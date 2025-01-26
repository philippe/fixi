<h1>&#x1F6B2; fixi.js - <i>it ain't much...</i></h1> 


[fixi.js](https://swag.htmx.org/products/fixi-js-tee) is an experimental, minimalist implementation
of [generalized hypermedia controls](https://dl.acm.org/doi/fullHtml/10.1145/3648188.3675127)

The fixi [api](#api) consists of six [HTML attributes](#attributes), nine [events](#events) & two [properties](#properties)

Here is an example:

```html
<button fx-action="/content" <!-- URL to issue request to -->
        fx-method="get"      <!-- HTTP Method to use -->
        fx-trigger="click"   <!-- Event that triggers the request -->
        fx-target="#output"  <!-- Element to swap -->
        fx-swap="innerHTML"> <!-- How to swap -->
    Get Content
</button>
<output id="output"></output>
```

When this fixi-powered `button` is clicked it  will issue an HTTP `GET` request to the 
`/content` [relative URL](https://www.w3.org/TR/WD-html40-970917/htmlweb.html#h-5.1.2) and swap the HTML content of 
the response inside the `output` tag below it.

## Fork Addition

This fork of Fixi adds configuration options, inheritance of attributes, support for the target set to `"this"` or simply an empty `target` attribute, and a logger! All of this comes with a small addition of just 250 characters to the original code!

### General Configuration

You can now configure general parameters using the new global `fixi` variable.


```js
let fixi = { 
    prefix: "fx-", 
    headers: {
        "FX-Request": "true"
    }, 
    default: {
        swap: "outerHTML"
    }, 
    logger:()=>{}
};
```
Here is how I like it! Verbose and clean! Small remarque here ... when you decide to use an empty prefix, `fixi:` will be use as the prefix of event name (ie: fixi:init)

```html
<script src="fixi.js"></script>
<script>
    fixi.logger = (...args) => console.log(...args);
    fixi.prefix = ""
    fixi.default.swap = "innerHTML"
</script>
```

Other "major" modif if the return of inheritance of htmx like:

```html
<div target swap="outerHTML">
    <div><label>First Name</label>: Joe</div>
    <div><label>Last Name</label>: Blow</div>
    <div><label>Email</label>: joe@blow.com</div>
    <button action="/user/edit">
    Click To Edit
    </button>
</div>
```

Documentation is not my force! let me know if you have any questions

## Minimalism

Philosophically, fixi is [scheme](https://scheme.org/) to [htmx](https://htmx.org)'s
[common lisp](https://lisp-lang.org/): it is designed to be as 
[lean as possible](https://ia601608.us.archive.org/8/items/pdfy-PeRDID4QHBNfcH7s/LeanSoftware_text.pdf) while still 
being useful for real world projects.

As such, it doesn't have many of the features found in htmx, including:

* [request queueing & synchronization](https://htmx.org/attributes/hx-sync/)
* [extended selector support](https://htmx.org/docs/#extended-css-selectors)
* [extended event support](https://htmx.org/docs/#special-events)
* [attribute inheritance](https://htmx.org/docs/#inheritance)
* [request indicators](https://htmx.org/docs/#indicators)
* [CSS transitions](https://htmx.org/docs/#css_transitions)
* [history support](https://htmx.org/docs/#history)

fixi takes advantage of some modern JavaScript features not used by htmx:

* [`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
* the [`fetch()` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
* the use of [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) for monitoring when new content is added
* The [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) (used by htmx, but the sole mechanism for transitions in fixi)

A hard constraint on the project is that the _unminified_, _uncompressed_ size must be less than that of
the minified & compressed version of the (excellent) [preact library](https://bundlephobia.com/package/preact) (currently 4.6Kb).

The current uncompressed size is `3532` bytes and the gzip'd size is `1505` bytes as determined by:

```bash
ls -l fixi.js | awk  '{print "raw:", $5}'; gzip -k fixi.js; ls -l fixi.js.gz | awk  '{print "gzipped:", $5}'; rm fixi.js.gz 
```

Another goal is that users should be able to [debug](https://developer.chrome.com/docs/devtools/javascript/) 
fixi easily, since it is small enough to use unminified.

The code style is [dense](fixi.js), but the statements are structured for debugging.

Like a fixed-gear bike, fixi has very few moving parts:

* No dependencies (including test and development)
* No JavaScript API (beyond the [events](#events))
* No `fixi.min.js` file
* No `package.json`
* No build step

The fixi project consists of three files:

* [`fixi.js`](fixi.js), the code for the library
* [`test.html`](test.html), the test suite for the library
* This [`README.md`](README.md), which is the documentation

[`test.html`](test.html) is a stand-alone HTML file that implements its own visual testing infrastructure, mocking for 
`fetch()`, etc. and that can be opened using the `file:` protocol for easy testing.

## Installing

fixi is intended to be [vendored](https://macwright.com/2021/03/11/vendor-by-default), that is, copied, into your 
project:

```bash
curl https://raw.githubusercontent.com/philippe/fixi/refs/tags/0.5.4/fixi.js >> fixi-0.5.4.js
```

The SHA256 of v0.5.4 is 

`72ZBBUuEmYH/qoxctmqzJfwcZKdbZKUK0LAYFCB4XR4=`

generated by the following command line script:

```bash
cat fixi.js | openssl sha256 -binary | openssl base64
```
Alternatively can download the source from here:

<https://github.com/philippe/fixi/archive/refs/tags/0.5.4.zip>

You can also use the JSDelivr CDN for local development or testing:

```html
<script src="https://cdn.jsdelivr.net/gh/philippe/fixi@0.5.4/fixi.js"
        crossorigin="anonymous"
        integrity="sha256-hOYSyRfq/mzm1IZ5sl9cBCLOdLyD6K8JrQ/bS+j8j54="></script>
```

fixi is not distributed via [NPM](https://www.npmjs.com/).

## API

### Attributes

<table>
<thead>
<tr>
  <th>attribute</th>
  <th>description</th>
  <th>example</th>
</tr>
</thead>
<tbody>
<tr>
  <td>
    <code>fx&#8209;action</code>
  </td>
  <td>
    The URL to which an HTTP request will be issued, required
  </td>
  <td>
    <code>fx&#8209;action='/demo'</code>
  </td>
</tr>
<tr>
<td><code>fx&#8209;method</code></td>
<td>The HTTP Method that will be used for the request (case&#8209;insensitive), defaults to <code>GET</code></td>
<td><code>fx&#8209;method=&#39;DELETE&#39;</code></td>
</tr>
<tr>
<td><code>fx&#8209;target</code></td>
<td>A CSS selector specifying where to place the response HTML in the DOM, defaults to the current element</td>
<td><code>fx&#8209;target=&#39;#a&#8209;div&#39;</code></td>
</tr>
<tr>
<td><code>fx&#8209;swap</code></td>
<td>A string specifying how the content should be swapped into the DOM, cane be one of <code>innerHTML</code>, <code>outerHTML</code>, <code>beforestart</code>, <code>afterstart</code>, <code>beforeend</code>, <code>afterend</code>, or any valid property on the element (e.g. `className` or `value`).  <code>outerHTML</code> is the default.</td>
<td><code>fx&#8209;swap=&#39;innerHTML&#39;</code></td>
</tr>
<tr>
<td><code>fx&#8209;trigger</code></td>
<td>The event that will trigger a request.  Defaults to <code>submit</code> for <code>form</code> elements, <code>change</code> for <code>input</code>&#8209;like elements & <code>click</code> for all other elements</td>
<td><code>fx&#8209;trigger=&#39;click&#39;</code></td>
</tr>
<tr>
<td><code>fx&#8209;ignore</code></td>
<td>Any element with this attribute on it or on a parent will not be processed for <code>fx&#8209;*</code> attributes</td>
<td></td>
</tr>
</tbody>
</table>

#### Modus Operandi

fixi works in a straight-forward manner & I encourage you to look at [the source](fixi.js) as you read through this. The 
three components of fixi are:

* [Processing](#processing) elements in the DOM (or added to the DOM)
* Issuing HTTP [requests](#requests) in response to events
* [Swapping](#swapping) new HTML content into the DOM

##### Processing

The main entry point is found at the bottom of [fixi.js](fixi.js): on the `DOMContentLoaded` event fixi does two things:

* It establishes a MutationObserver to watch for newly added content with fixi-powered elements
* It processes any existing fixi-powered elements

fixi-powered elements are elements with the `fx-action` attribute on them.

When fixi finds one it will establish an event listener on that element that will dispatch an AJAX request via 
`fetch()` to the URL specified by `fx-action`.

fixi will ignore any elements that have the `fx-ignore` attribute on them or on a parent.

The event that will trigger the request is determined by the `fx-trigger` attribute.

If that attribute is not present, the trigger defaults to:

* `submit` for `form` elements
* `change` for `input:not([type=button])`, `select` & `textarea` elements
* `click` for everything else.

##### Requests

When a request is triggered, the [HTTP method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) of the request 
will be determined by the `fx-method` attribute.  If this attribute is not present, it will default to `GET`.  This 
attribute is case-insensitive.

fixi sends the [request header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) `FX-Request`, with the value 
`true`.  You can add or remove headers using the `evt.detail.cfg.headers` object, see the [`fx:config`](#fxconfig) event 
below.

If an element is within a form element or has a `form` attribute, the values of that form will be included with the
request.  Otherwise, if the element has a `name`, its `name` & `value` will be sent with the request.   You can add or 
remove values using the `evt.detail.cfg.form` `FormData` object in the [`fx:config`](#fxconfig) event.

`GET` & `DELETE` requests will include values via query parameters, other request types will submit them as a form
encoded body.

Before a request is sent, the aforementioned [`fx:config`](#fxconfig) event is triggered, which can be used to configure
aspects of the request. If `preventDefault()` is invoked in this event, the request will not be sent.
The `evt.detail.cfg.drop` property will be set to `true` if there is an existing outstanding request associated with 
the element and, if it is not set to `false` in an event handler, the request will be dropped (i.e. not issued).

In the [`fx:config`](#fxconfig) event you can also set the `evt.detail.cfg.confirm` property to a no-argument function.
This function can return a Promise and can be used to asynchronously confirm that the request should be issued:

```js
function showAsynConfirmDialog() {
    //... a Promise-based confirmation dialog...
}

document.addEventListener("fx:config", (evt) => {
    evt.detail.cfg.confirm = showAsynConfirmDialog;
})
```

Note that confirmation will only occur if the [`fx:config`](#fxconfig) event is not canceled and the request is not
dropped.

After the configuration step and the confirmation, if any, the [`fx:before`](#fxbefore) event will be triggered,
and then a `fetch()` will be issued.  The `evt.detail.cfg` object from the events above  is passed to the `fetch()` 
function as the second [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) argument.

When fixi receives a response it triggers the [`fx:after`](#fxafter) event.

In this event there are two more properties available on `evt.detail.cfg`:

* `response` the fetch [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object
* `text` the text of the response

These can be inspected, and the `text` value can be changed if you want to transform it in some way.

If an error occurs the [`fx:error`](#fxerror) event will be triggered instead of `fx:after`.

Note that `fetch()` only triggers errors 
[when a request fails due to a bad URL or network error](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch),
so valid HTTP responses with non-`200` response codes will not trigger an error.  If you wish to handle those differently
you should check the response code in the `fx:after` event:

```js
document.addEventListener("fx:after", (evt)=>{
  // rewire 404s to the body, remove current head so new head can replace it
  if (evt.detail.cfg.response.status == 404){
    document.head.remove()
    evt.detail.cfg.target = docuement.body
    evt.detail.cfg.swap = 'outerHTML'
  }
})
```

The [`fx:finally`](#fxfinally) event will be triggered regardless if an error occurs or not.

##### Swapping

fixi then swaps the response text into the DOM using the mechanism specified by `fx-swap`, targeting the element specified
by `fx-target`.  If the `fx-swap` attribute is not present, fixi will use `outerHTML`.

If the `fx-target` attribute is not present, it will target the element making the request.  

The swap mechanism and target can be changed in the request-related fixi events.

You can implement a custom swapping mechanism by setting a function into the `evt.detail.cfg.swap` property in one of
the request related events.  This function should take one argument that will be set to the fixi request config itself.  
On that object you can access the `target`, `text`, `request`, etc.  You can see 
an [example below](#custom-swapping-algorithms) showing how to do this.

By default, swapping will occur in a [View Transition](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
if they are available.  If you don't want this to occur, you can set the `evt.detail.cfg.transition` property to false
in one of the request-related events.

Finally, when the swap and any associated View Transitions have completed, the `fx:swapped` event will be triggered on 
the element.

#### Complete Example

Here is an complete example using all the attributes available in fixi:

```html
<button fx-action="/demo" fx-method="GET" 
        fx-target="#output" fx-swap="innerHTML" 
        fx-trigger="click">
    Get Content
</button>
<output id="output" fx-ignore>--</output>
```

In this example, the button will issue a `GET` request to `/demo` and put the resulting HTML into the `innerHTML` of the
output element with the id `output`.

Because the `output` element is marked as `fx-ignore`, any `fx-action` attributes in the new content will be ignored.

### Events

fixi fires the following events, broken into two categories:

<table>
<thead>
<tr>
  <th>category</th>
  <th>event</th>
  <th>description</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="3"><a href="#initialization-events">initialization</a></td>
<td>
<a href="#fxinit"><code>fx:init</code></a>
</td>
<td>
triggered on elements that have a <code>fx-action</code> attribute and are about to be initialized by fixi
</td>
</tr>
<tr>
<td>
<a href="#fxinited"><code>fx:inited</code></a>
</td>
<td>
triggered on elements have been initialized by fixi (does <b>not</b> bubble)
</td>
</tr>
<tr>
<td>
<a href="#fxprocess"><code>fx:process</code></a>
</td>
<td>
fixi listens on the <code>document</code> object for this event and will process (that is, enable any fixi-powered 
elements) within that element.
</td>
</tr>
<tr>
<td rowspan="6"><a href="#fetch-events">fetch</a></td>
<td>
<a href="#fxconfig"><code>fx:config</code></a>
</td>
<td>
triggered on an element immediately when a request has been triggered, allowing users to configure the request
</td>
</tr>
<tr>
<td>
<a href="#fxbefore"><code>fx:before</code></a>
</td>
<td>
triggered on an element just before a <code>fetch()</code> request is made
</td>
</tr>
<tr>
<td>
<a href="#fxafter"><code>fx:after</code></a>
</td>
<td>
triggered on an element just after a <code>fetch()</code> request finishes normally but before content is swapped
</td>
</tr>
<tr>
<td>
<a href="#fxerror"><code>fx:error</code></a>
</td>
<td>
triggered on an element if an exception occurs during a <code>fetch()</code>
</td>
</tr>
<tr>
<td>
<a href="#fxfinally"><code>fx:finally</code></a>
</td>
<td>
triggered on an element after a request no matter what
</td>
</tr>
<tr>
<td>
<a href="#fxswapped"><code>fx:swapped</code></a>
</td>
<td>
triggered after the swap and any associated 
<a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API">View Transition</a> has completed
</td>
</tr>
</tbody>
</table>

#### Initialization Events

##### `fx:init`

The `fx:init` event is triggered when fixi is processing a node with an `fx-action` attribute. One property
is available in `evt.detail`:

* `options` - An [Options Object](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options)
              that will be passed to `addEventListener()`

If this event is cancelled via `preventDefault()`, the element will not be initialized by fixi.

##### `fx:inited`

The `fx:inited` event is triggered when fixi finished processing a node with an `fx-action` attribute.

Unlike other fixi events, this event does not bubble.

##### `fx:process`

fixi listens for the `fx:process` event on the `document` and will enable any unprocessed fixi-powered elements within
the element as well as the element itself.  

#### Fetch Events

fixi uses the [`fetch()` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to issue HTTP requests. It
triggers events around this call that allow users to configure the request.

##### `fx:config`

The first event triggered is `fx:config`. This event can be used to configure the arguments passed to `fetch()` via the
fixi config object, which can be found at `evt.detail.cfg`.

This config object has the following properties:

* `trigger` - The event that triggered the request
* `method` - The HTTP Method that is going to be used
* `action` - The URL that the request is going to be issued to
* `headers` - An Object of name/value pairs to be sent as HTTP Request Headers
* `target` - The target element that will be swapped when the response is processed
* `swap` - The mechanism by which the element will be swapped
* `body` - The body of the request, if present, a FormData object that holds the data of the form associated with the
* `drop` - Whether this request will be dropped, defaults to `true` if a request is already in flight
* `transition` - The View Transition function, if it is available.  Set to `false` if you don't want a transition to occur.
* `preventTriggerDefault` - A boolean (defaults to true) that, if true, will call `preventDefault()` on the triggering
  event
* `signal` - The AbortSignal of the related AbortController for the request
* `abort()` - A function that can be invoked to abort the pending fetch request
* `fetch()` - The fetch() function that will be used for the request, can be used for [mocking](#mocking) requests

Mutating the `method`, etc. properties of the `cfg` object will change the behavior of the request dynamically. Note
that the `cfg` object is passed to `fetch()` as the second argument of type `RequestInit`, so any properties you want
to set on the `RequestInit` may be set on the `cfg` object (e.g. `credentials`).

Another property available on the `detail` of this event is `requests`, which will be a 
[Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of any existing
outstanding requests for the element.

fixi does not implement request queuing like htmx does, but you can implement a simple
"replace existing requests in flight" rule with the following JavaScript:

```js
document.addEventListener("fx:config", (evt) => {
    evt.detail.cfg.drop = false;  // allow this request to be issued even if there are other requests
    evt.detail.requests.forEach((cfg) => cfg.abort()); // abort all existing requests
})
```

If you call `preventDefault()` on this event, no request will be issued.

##### `fx:before`

The  `fx:before` event is triggered just before a `fetch()` is issues. The config will again be available in the
`evt.detail.cfg` property, but after any confirmation is done.  The requests will also be available in 
`evt.detail.requests` and will include the current request.

If you call `preventDefault()` on this event, no request will be issued.

##### `fx:after`

The  `fx:after` event is triggered after a `fetch()` successfully completes. The config will again be available in the
`evt.detail.cfg` property, and will have two additional properties:

* `response` - The response object from the `fetch()` call
* `text` - The text of the response

At this point you may still mutate the `swap`, etc. attributes to affect swapping, and you may mutate the `text` if you
want to modify it is some way before it is swapped.

Calling `preventDefault()` on this event will prevent swapping from occurring.

##### `fx:error`

The  `fx:error` event is triggered when a network error occurs. In this case the `cfg.txt` will be set to a blank
string, and the `evt.detail.cfg` object is available for modification.

Calling `preventDefault()` on this event will prevent swapping from occurring. Note that `AbortError`s will also prevent
swapping.

##### `fx:finally`

The  `fx:finally` event is triggered regardless if an error occurs or not and can be used to clean up after a request.
Again the `evt.detail.cfg` object is available for modification.

##### `fx:swapped`

The  `fx:swapped` event is triggered once the swap and any associated View Transitions complete.  The 
`evt.detail.cfg` object is available.

### Properties

fixi adds two properties to elements in the DOM

<table>
<thead>
<tr>
  <th>property</th>
  <th>description</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<a href="#document__fixi_mo"><code>document.__fixi_mo</code></a>
</td>
<td>
The MutationObserver that fixi uses to watch for new content to process new fixi-powered elements.
</td>
</tr>
<tr>
<td>
<a href="#elt__fixi"><code>elt.__fixi</code></a>
</td>
<td>
The event handler created by fixi on fixi-powered elements 
</td>
</tr>
</tbody>
</table>

#### `document.__fixi_mo`

fixi stores the Mutation Observer that it uses to watch for new content in the `__fixi_mo` property on the `document`.

You can use this property to temporarily disable mutation observation for performance reasons:

```js
// disable processing
document.__fixi_mo.disconnect()

/* ... heavy mutation code that should not be processed by fixi */

// reenable processing
document.__fixi_mo.observe(document.body, {childList:true, subtree:true})
```
Similar code can be used to adjust the MutationObserver to listen for mutations in some subset of the document.

Finally, you can also switch to entirely manual processing using the [`fx:after`](#fxafter), 
[`fx:swapped`](#fxswapped) & [`fx:process`](#fxprocess) events:

```js
document.__fixi_mo.disconnect()
document.addEventListener("fx:after", (evt)=>{
  // capture the parent element of the target in the config before swapping
  evt.detail.cfg.parent = evt.detail.cfg.target.parentElement
})
document.addEventListener("fx:swapped", (evt)=>{
  // reprocess the parent
  evt.detail.cfg.parent.dispatchEvent(new CustomEvent("fx:process"), {bubbles:true})
})
```

#### `elt.__fixi`

The `__fixi` property will be added to any element that has an `fx-action` attribute on it assuming that the element
or a parent is not marked `fx-ignore`.  

The value of the property will be the event listener that is added to the element.  It also has two properties:

* `evt` - the string event name that will trigger the handler
* `requests` - the config values of any open requests (may be `null`)

This property can be used to remove the fixi-generated event handler like so:

```js
elt.removeEventListener(elt.__fixi.evt, elt.__fixi)
```

If you want to reprocess the element you will need to remove the property entirely and trigger the 
[`fx:process`](#fxprocess) event on it:

```js
elt.removeEventListener(elt.__fixi.evt, elt.__fixi)
delete elt.__fixi
elt.dispatchEvent(new CustomEvent("fx:process"), {bubbles:true})
```

You can also use this property to store extension-related information.  See the [polling example](#polling) below.

## Mocking

It is easy to mock `fetch()` requests in fixi by replacing the `evt.detail.cfg.fetch` property with a mocking function.
The function can take the same arguments as [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) (or not
if they are not needed) and should return a [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
compatible object or a Promise that resolves to one.

For the simple case, the return object need only implement the `.text()` method.

Here is an example that mocks responses using `template` elements

```js
document.addEventListener("fx:config", (evt) => {
   const template = document.getElementById(evt.detail.cfg.action)
   if (template) {
     evt.detail.cfg.fetch = ()=>({text:  ()=>template.innerHTML}) // note the parens to make {} an object
   }
 })
```
```html
<button fx-action="/demo">
    Replace Me With A Template
</button>
<template id="/demo">
    Some Template Content...
</template>
```

## Examples

Here are some basic examples of fixi in action

### Click To Edit

The htmx [click to edit example](https://htmx.org/examples/click-to-edit/) can be easily ported to fixi:

```html
<div id="target-div">
    <div><label>First Name</label>: Joe</div>
    <div><label>Last Name</label>: Blow</div>
    <div><label>Email</label>: joe@blow.com</div>
    <button fx-action="/contact/1/edit" fx-target="#target-div" class="btn primary">
    Click To Edit
    </button>
</div>
```

### Delete Row

The [delete row example]() from htmx can be implemented in fixi like so:

```html
<tr id="row-1">
  <td>Angie MacDowell</td>
  <td>angie@macdowell.org</td>
  <td>Active</td>
  <td>
    <button class="btn danger" fx-action="/contact/1" fx-method="delete" fx-target="#row-1">
      Delete
    </button>
  </td>
</tr>
```

Note that this version does not have a confirmation prompt, you would need to implement that yourself using the
[`fx:config`](#fxconfig) event.

### Lazy Loading

The htmx [lazy loading](https://htmx.org/examples/lazy-load/) example can be ported to fixi using the 
[`fx:inited`](#fxinited) event:

```html
<div fx-action="/lazy-content" fx-trigger="fx:inited">
  Content Loading...
</div>
```

## Extensions

Because fixi is minimalistic the user is responsible for implementing many behaviors they want via events. We have
already seen how to abort an existing request that is already in flight.  

The convention when you are adding fixi extension attributes is to use the `ext-fx` prefix, and to process the extension
in the `fx:init` method.  You may find it useful to use the `__fixi` property on the element to store values on 

Here are some examples of useful fixi extensions implemented using events.

### Disabling an Element During A Request

Here is an example that will use attributes to disable an element when a request is in flight:

```js
document.addEventListener("fx:init", (evt)=>{
  if (evt.target.matches("[ext-fx-disable]")){
    var disableSelector = evt.target.getAttribute('ext-fx-disable')
    evt.target.addEventListener('fx:before', ()=>{
      let disableTarget = disableSelector == "" ? evt.target : document.querySelector(disableSelector)
      disableTarget.disabled = true
      evt.target.addEventListener('fx:after', (afterEvt)=>{
        if (afterEvt.target == evt.target){
          disableTarget.disabled = true
        }
      })
    })
  }
})
```
```html
<button fx-action="/demo" ext-fx-disable>
  Demo
</button>
```

### Showing an Indicator During A Request

Here is an example that will use attributes a `fixi-request-in-flight` class to show an indicator of some kind:

```js
document.addEventListener("fx:init", (evt)=>{
  if (evt.target.matches("[ext-fx-indicator]")){
    var disableSelector = evt.target.getAttribute("ext-fx-indicator")
    evt.target.addEventListener("fx:before", ()=>{
      let disableTarget = disableSelector == "" ? evt.target : document.querySelector(disableSelector)
      disableTarget.classList.add("fixi-request-in-flight")
      evt.target.addEventListener("fx:after", (afterEvt)=>{
        if (afterEvt.target == evt.target){
          disableTarget.classList.remove("fixi-request-in-flight")
        }
      })
    })
  }
})
```
```html
<style>
  #indicator {
    display: none;
  }
  #indicator .fixi-request-in-flight {
    display: inline-block;
  }
</style>
<button fx-action="/demo" ext-fx-indicator="#indicator">
    Demo
   <img src="spinner.gif" id="indicator">
</button>
```

This example can be modified to use classes or other mechanisms for showing indicators as well.

### Debouncing A Request

Here is an implementation of the Active Search example from htmx done in fixi, utilizing the config `confirm` feature
to return a promise that resolves to `true` after the number of milliseconds specified by `fx-ext-debounce` if no
other triggers have occurred:

```js
document.addEventListener("fx:init", (evt)=>{
  let elt = evt.target
  if (elt.matches("[ext-fx-debounce]")){
    let latestPromise = null;
    elt.addEventListener("fx:config", (evt)=>{
      evt.detail.drop = false
      evt.detail.cfg.confirm = ()=>{
        let currentPromise = latestPromise = new Promise((resolve) => { 
          setTimeout(()=>{
            resolve(currentPromise === latestPromise)
          }, parseInt(elt.getAttribute("ext-fx-debounce")))
        })
        return currentPromise
      }
    })
  }
})
```
```html
<form action="/search" fx-action="/search" fx-target="#results" fx-swap="innerHTML">
  <input id="search" type="search" fx-action="/search" fx-trigger="input" ext-fx-debounce="200" fx-target="#results" fx-swap="innerHTML"/>
  <button type="submit">
    Search
  </button>
</form>
<table>
  ...
  <tbody id="results">
  ...
  </tbody>
</table>
```

### Polling

htmx-style polling can be implemented in the following manner:

```js
document.addEventListener("fx:inited", (evt)=>{ // use fx:inited so the __fixi property is available
  let elt = evt.target
  if (elt.matches("[ext-fx-poll-interval]")){
    // squirrel away in case we want to call clearInterval() later
    elt.__fixi.pollInterval = setInterval(()=>{
      elt.dispatchEvent(new CustomEvent("poll"))
    }, parseInt(elt.getAttribute("ext-fx-poll-interval")))
  }
})
```
```html
<h3>Live News</h3>
<div fx-action="/news" fx-trigger="poll" ext-fx-poll-interval="300">
  ... initial content ...
</div>
```

### Confirmation

This extension implements a simple `confirm()` based confirmation if the `ext-fx-confirm` attribute is found.  Note that
it does not use a Promise, just the regular old blocking `confirm()` function

```js
document.addEventListener('fx:config', (evt)=>{
	var confirmationMessage = evt.target.getAttribute("ext-fx-confirm")
	if (confirmationMessage){
      evt.detail.cfg.confirm = ()=> confirm(confirmationMessage)
	}
})
```
```html
<button fx-action="/demo" fx-method="delete" ext-fx-confirm="Are you sure?">
    Delete It
</button>
```

### Relative Selectors

This extension implements relative selectors for the `fx-target` attribute.

```js
document.addEventListener('fx:config', (evt)=>{
	console.log("here")
	var target = evt.target.getAttribute("fx-target") || ""
	if (target.indexOf("closest ") == 0){
		evt.detail.cfg.target = evt.target.closest(target.substring(8))
	} else if (target.indexOf("find ") == 0){
		evt.detail.cfg.target = evt.target.closest(target.substring(5))
	} else if (target.indexOf("next ") == 0){
		var matches = Array.from(document.querySelectorAll(target.substring(5)))
		evt.detail.cfg.target = matches.find((elt) => evt.target.compareDocumentPosition(elt) === Node.DOCUMENT_POSITION_FOLLOWING)
	} else if (target.indexOf("previous ") == 0){
		var matches = Array.from(document.querySelectorAll(target.substring(9))).reverse()
		evt.detail.cfg.target = matches.find((elt) => evt.target.compareDocumentPosition(elt) === Node.DOCUMENT_POSITION_PRECEDING)
	}
})
```
```html
<button fx-action="/demo" fx-target="next output">
    Get Data
</button>
<output></output>
```

### Intersection Events

fixi does not trigger events when elements become visible like htmx does, but you can implement this behavior with the
following extension.  It adds an [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
for every element with the `intersect` trigger and wires it in to trigger that event once the element intersects
the viewport.  

```js
document.addEventListener("fx:init", (evt) => {
    let trigger = evt.target.getAttribute("fx-trigger")
    if(trigger === "intersect") {
        let obs = evt.target.__fixi_ob = new IntersectionObserver((entries)=>{
            for(const entry of entries) {
                if (entry.isIntersecting){
                    // done observing, remove
                    obs.unobserve(evt.target)
                    evt.target.__fixi_ob = null;
                    // trigger event
                    evt.target.dispatchEvent(new CustomEvent("intersect"))
                    return;
                }
            }
        })
        obs.observe(evt.target)
    }
})
```

With this extension it is possible to implement the [infinite scroll](https://htmx.org/examples/infinite-scroll/)
example:

```html
<tr fx-action="/contacts/?page=2"
    fx-trigger="intersect"
    fx-swap="afterend">
  <td>Agent Smith</td>
  <td>void29@null.org</td>
  <td>55F49448C0</td>
</tr>
```

### Custom Swapping Algorithms

You can implement a custom swap strategies using the [`fx:config`](#fxconfig) event, and wiring in a function for the
`evt.detail.cfg.swap` property.  Here is an example that allows you to use 
[Idiomorph](https://github.com/bigskysoftware/idiomorph), a morphing algorithm, with the `morph` & `innerMorph` values
in `fx-swap`:

```js
document.addEventListener("fx:config", (evt) => {
  function morph(cfg, style) {
    Idiomorph.morph(cfg.target, cfg.text, { morphStyle: style }).forEach((n) => {
      // process nodes as morphing existing nodes will not trigger fixi MutationObserver
      n.dispatchEvent(new CustomEvent("fx:process", { bubbles: true }));
    });
  }
  if (evt.detail.cfg.swap == "morph")
    evt.detail.cfg.swap = (cfg) => morph(cfg, "outerHTML");
  if (evt.detail.cfg.swap == "innerMorph")
    evt.detail.cfg.swap = (cfg) => morph(cfg, "innerHTML");
});
```
```html
<h3>Morph</h3>
<button fx-action="/demo" fx-swap="morph" fx-target="#output">
  Morph New Content
</button>
<output id="output"></output>
```

## LICENCE

```
Zero-Clause BSD
=============

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED “AS IS” AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLEs
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN
AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT
OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

<h2>&#x1f480; <i>Memento Mori</i></h2>

```js
/**
* Adding a single line to this file requires great internal reflection
* and thought.  You must ask yourself if your one line addition is so
* important, so critical to the success of the company, that it warrants
* a slowdown for every user on every page load.  Adding a single letter
* here could cost thousands of man hours around the world.
* 
* That is all.
*/
```

-- [A comment](https://www.youtube.com/watch?v=wHlyLEPtL9o&t=1528s) at the beginning of [Primer](https://gist.github.com/makinde/376039)

