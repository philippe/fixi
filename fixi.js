(()=>{
	let init = elt=>{
		let options = {},
				send = (type, detail, bubbles=true)=>elt.dispatchEvent(new CustomEvent("fx:" + type, {detail, cancelable:true, bubbles, composed:true})),
				attr = (name, defaultVal)=>elt.getAttribute('fx-'+name) ?? defaultVal
		if (elt.__fixi || elt.closest("[fx-ignore]") || !send("init", {options})) return
		elt.__fixi = async evt=>{
			let reqs = elt.__fixi.requests ??= new Set(),
					form = elt.form ?? elt.closest("form"),
					body = new FormData(form ?? undefined, evt.submitter),
					abort = new AbortController()
			if (!form && elt.name) body.append(elt.name, elt.value)
			let cfg = {
				trigger: evt, 
				action: attr("action"), 
				method: attr("method", "GET").toUpperCase(), 
				target: document.querySelector(attr("target")) ?? elt, 
				swap: attr("swap", "outerHTML"), 
				body, 
				drop: reqs.length > 0, 
				headers: {"FX-Request":true}, 
				abort: r=>abort.abort(r), 
				signal: abort.signal, 
				preventTriggerDefault: true,
				transition: document.startViewTransition?.bind(document),
				fetch: fetch.bind(window)
			}
			if (!send("config", {evt, cfg, requests:reqs}) || cfg.drop) return
			if (/GET|DELETE/.test(cfg.method)){
				if (!cfg.body.entries().next().done) cfg.action += '?&'[cfg.action.includes("?")] + new URLSearchParams(cfg.body).toString()
				cfg.body = null
			}
			if (cfg.preventTriggerDefault) evt.preventDefault()
			reqs.add(cfg)
			try {
				if (cfg.confirm && !await cfg.confirm()) return
				if (!send("before", {evt, cfg, requests:reqs})) return
				cfg.response = await cfg.fetch(cfg.action, cfg)
				cfg.text = await cfg.response.text()
				if (!send("after", {evt, cfg})) return
			} catch(error) {
				return send("error", {evt, cfg, error})
			} finally {
				reqs.delete(cfg)
				send("finally", {evt, cfg})
			}
			let doSwap = ()=>{
				if (cfg.swap instanceof Function) cfg.swap(cfg)
				else if (/(before|after)(start|end)/.test(cfg.swap)) cfg.target.insertAdjacentHTML(cfg.swap, cfg.text)
				else if(cfg.swap in cfg.target) cfg.target[cfg.swap] = cfg.text
				else throw cfg.swap
			}
			await (cfg.transition || doSwap)(doSwap)?.finished
			send("swapped", {cfg})
		}
		elt.addEventListener(
			elt.__fixi.evt = attr("trigger", elt.matches("form") ? "submit" : elt.matches("input:not([type=button]),select,textarea") ? "change" : "click"), 
			elt.__fixi, options)
		send("inited", {}, false)
	}
	let process = elt=>{
		if (elt instanceof Element){
			if (elt.matches("[fx-action]")) init(elt)
			elt.querySelectorAll("[fx-action]").forEach(init)
		}
	}
	document.addEventListener("fx:process", evt=>process(evt.target))
	document.addEventListener("DOMContentLoaded", ()=>{
		(document.__fixi_mo = new MutationObserver(recs=>recs.forEach(r=>r.type === "childList" && r.addedNodes.forEach(process))))
			.observe(document.body, {childList:true, subtree:true})
		process(document.body)
	})
})()
