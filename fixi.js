let fixi = { prefix:"fx-", headers:{"FX-Request":"true"}, default:{swap:"outerHTML"}, logger:()=>{}};
((fx)=>{
	let evtName = (evt)=> (fx.prefix ? fx.prefix.replace("-", ":"): "fixi:")+evt;
	let send = (elt, type, detail, bub)=>{fx.logger(type=evtName(type), elt, detail); return elt.dispatchEvent(new CustomEvent(type, {detail:detail, cancelable:true, bubbles:bub !== false, composed:true}))}
	let attr = (elt, attr, defaultVal=null)=>elt.closest("["+fx.prefix+attr+"]")?.getAttribute(fx.prefix+attr) || defaultVal
	let ignore = (elt)=>attr(elt, "ignore", null) !== null
	let init = (elt)=>{
		let options = {}
		if (elt.__fixi || ignore(elt) || !send(elt, "init", {options})) return
		elt.__fixi = async(evt)=>{
			let reqs = elt.__fixi.requests ||= new Set()
			let targetSelector = attr(elt, "target")
			let target = targetSelector === "this" ? elt.closest(`[${fx.prefix}target]`): document.querySelector(targetSelector) || elt
			let method = attr(elt, "method", "GET").toUpperCase()
			let action = attr(elt, "href", attr(elt, "action", ""))
			let swap = attr(elt, "swap", fx.default.swap)
			let form = elt.form || elt.closest("form")
			let body = new FormData(form || undefined, evt.submitter)
			if (!form && elt.name) body.append(elt.name, elt.value)
			let abort = new AbortController()
			let drop = reqs.length > 0
			let cfg = {trigger:evt, method, action, headers:fx.headers, target, swap, body, drop, signal:abort.signal, abort:(r)=>abort.abort(r),
				preventDefault:true, transition:document.startViewTransition?.bind(document), fetch:fetch.bind(window)}
			if (!send(elt, "config", {evt, cfg, requests:reqs}) || cfg.drop) return
			if (/GET|DELETE/.test(cfg.method)) {
				if (!cfg.body.entries().next().done) cfg.action += (cfg.action.indexOf("?") > 0 ? "&": "?") + new URLSearchParams(cfg.body).toString()
				cfg.body = null
			}
			if (cfg.preventDefault) evt.preventDefault()
			reqs.add(cfg)
			try {
				if (cfg.confirm && !await cfg.confirm()) return
				if (!send(elt, "before", {evt, cfg, requests:reqs})) return
				cfg.response = await cfg.fetch(cfg.action, cfg)
				cfg.text = await cfg.response.text()
				if (!send(elt, "after", {evt, cfg})) return
			} catch(error) {
				cfg.text = ""
				if (!send(elt, "error", {evt, cfg, error})) return
				if (error.name === "AbortError") return
			} finally {
				reqs.delete(cfg)
				send(elt, "finally", {evt, cfg})
			}
			let doSwap = ()=>{
				if (cfg.swap instanceof Function)
					return cfg.swap(cfg)
				else if (/(before|after)(start|end)/.test(cfg.swap))
					cfg.target.insertAdjacentHTML(cfg.swap, cfg.text)
				else if (cfg.swap in cfg.target)
					cfg.target[cfg.swap] = cfg.text
				else throw cfg.swap
			}
			if (cfg.transition)
				await cfg.transition(doSwap).finished
			else
				await doSwap()
			send(elt, "swapped", {cfg})
		}
		elt.__fixi.evt = attr(elt, "trigger", elt.matches("form") ? "submit" : elt.matches("input:not([type=button]),select,textarea") ? "change" : "click")
		elt.addEventListener(elt.__fixi.evt, elt.__fixi, options)
		send(elt, "inited", {}, false)
	}
	let process = (elt)=>{
		if (elt instanceof Element){
			if (ignore(elt)) return
			let attrs = `[${fx.prefix}href],[${fx.prefix}action]`
			if (elt.matches(attrs)) init(elt)
			elt.querySelectorAll(attrs).forEach((elt)=>init(elt))
		}
	}
	document.addEventListener(evtName("process"), (evt)=>process(evt.target))
	document.addEventListener("DOMContentLoaded", ()=>{
		(fixi.mo = new MutationObserver((recs)=>recs.forEach((r)=>r.type === "childList" && r.addedNodes.forEach((n)=>process(n))))).observe(document.body, {childList:true, subtree:true})
		process(document.body)
	})
})(fixi)