(()=>{
	let send = (elt, type, detail, bub)=>elt.dispatchEvent(new CustomEvent("fx:" + type, {detail, cancelable:true, bubbles:bub !== false, composed:true}))
	let attr = (elt, name, defaultVal)=>elt.getAttribute(name) || defaultVal
	let ignore = (elt)=>elt.matches("[fx-ignore]") || elt.closest("[fx-ignore]") != null
	let init = (elt)=>{
		let options = {}
		if (elt.__fixi || ignore(elt) || !send(elt, "init", {options})) return
		elt.__fixi = async(evt)=>{
			let reqs = elt.__fixi.requests ||= new Set()
			let action = attr(elt, "fx-action")
			let method = attr(elt, "fx-method", "GET").toUpperCase()
			let targetSelector = attr(elt, "fx-target")
			let target = targetSelector ? document.querySelector(targetSelector) : elt
			let swap = attr(elt, "fx-swap", "outerHTML")
			let form = elt.form || elt.closest("form")
			let body = new FormData(form || undefined, evt.submitter)
			if (!form && elt.name) body.append(elt.name, elt.value)
			let drop = !!reqs.size
			let headers = {"FX-Request":"true"}
			let abort = new AbortController()
			let cfg = {trigger:evt, action, method, target, swap, body, drop, headers, abort:(r)=>abort.abort(r),
				signal:abort.signal, preventTriggerDefault:true, transition:document.startViewTransition?.bind(document), fetch:fetch.bind(window)}
			if (!send(elt, "config", {evt, cfg, requests:reqs}) || cfg.drop) return
			if (/GET|DELETE/.test(cfg.method)){
				if (!cfg.body.entries().next().done) cfg.action += (cfg.action.indexOf("?") > 0 ? "&" : "?") + new URLSearchParams(cfg.body)
				cfg.body = null
			}
			if (cfg.preventTriggerDefault) evt.preventDefault()
			reqs.add(cfg)
			try {
				if (cfg.confirm){
					let result = await cfg.confirm()
					if (!result) return
				}
				if (!send(elt, "before", {evt, cfg, requests:reqs})) return
				cfg.response = await cfg.fetch(cfg.action, cfg)
				cfg.text = await cfg.response.text()
				if (!send(elt, "after", {evt, cfg})) return
			} catch(error) {
				send(elt, "error", {evt, cfg, error})
				return
			} finally {
				reqs.delete(cfg)
				send(elt, "finally", {evt, cfg})
			}
			let doSwap = ()=>{
				if (cfg.swap instanceof Function)
					return cfg.swap(cfg)
				else if (/(before|after)(start|end)/.test(cfg.swap))
					cfg.target.insertAdjacentHTML(cfg.swap, cfg.text)
				else if(cfg.swap in cfg.target)
					cfg.target[cfg.swap] = cfg.text
				else throw cfg.swap
			}
			if (cfg.transition)
				await cfg.transition(doSwap).finished
			else
				await doSwap()
			send(elt, "swapped", {cfg})
		}
		elt.__fixi.evt = attr(elt, "fx-trigger", elt.matches("form") ? "submit" : elt.matches("input:not([type=button]),select,textarea") ? "change" : "click")
		elt.addEventListener(elt.__fixi.evt, elt.__fixi, options)
		send(elt, "inited", {}, false)
	}
	let process = (elt)=>{
		if (elt instanceof Element){
			if (ignore(elt)) return
			if (elt.matches("[fx-action]")) init(elt)
			elt.querySelectorAll("[fx-action]").forEach((elt)=>init(elt))
		}
	}
	document.addEventListener("fx:process", (evt)=>process(evt.target))
	document.addEventListener("DOMContentLoaded", ()=>{
		document.__fixi_mo = new MutationObserver((recs)=>recs.forEach((r)=>r.type === "childList" && r.addedNodes.forEach((n)=>process(n))))
		document.__fixi_mo.observe(document.body, {childList:true, subtree:true})
		process(document.body)
	})
})()
