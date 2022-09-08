
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/IndexPage.svelte generated by Svelte v3.46.4 */

    const file$8 = "src/IndexPage.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let header;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let div1;
    	let p0;
    	let span0;
    	let t4;
    	let a1;
    	let t6;
    	let t7;
    	let p1;
    	let t8;
    	let a2;
    	let t10;
    	let t11;
    	let p2;
    	let span1;
    	let t13;
    	let a3;
    	let t15;
    	let a4;
    	let t17;
    	let a5;
    	let t19;
    	let a6;
    	let t21;
    	let t22;
    	let p3;
    	let span2;
    	let t24;
    	let a7;
    	let t26;
    	let a8;
    	let t28;
    	let a9;
    	let t30;
    	let a10;
    	let t32;
    	let a11;
    	let t34;
    	let t35;
    	let p4;
    	let span3;
    	let t37;
    	let a12;
    	let t39;
    	let a13;
    	let t41;
    	let a14;
    	let t43;
    	let a15;
    	let t45;
    	let a16;
    	let t47;
    	let t48;
    	let p5;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Brian Dainton";
    			t2 = space();
    			div1 = element("div");
    			p0 = element("p");
    			span0 = element("span");
    			span0.textContent = "Today";
    			t4 = text(", I'm an\n      ");
    			a1 = element("a");
    			a1.textContent = "engineering leadership coach";
    			t6 = text(", startup\n      advisor, speaker, and mentor.");
    			t7 = space();
    			p1 = element("p");
    			t8 = text("I also run ");
    			a2 = element("a");
    			a2.textContent = "Verkout";
    			t10 = text(", the\n      quick daily workout challenge.");
    			t11 = space();
    			p2 = element("p");
    			span1 = element("span");
    			span1.textContent = "Built a life";
    			t13 = text(" as a\n      ");
    			a3 = element("a");
    			a3.textContent = "tech founder x 4";
    			t15 = text("\n      and a long-time\n      ");
    			a4 = element("a");
    			a4.textContent = "engineering leader";
    			t17 = text(". Won an\n      ");
    			a5 = element("a");
    			a5.textContent = "Emmy Award";
    			t19 = text("\n      along the way. Born and raised in Chicago. Computer Science at\n      ");
    			a6 = element("a");
    			a6.textContent = "UIUC";
    			t21 = text(". Married and\n      living in Austin. Trying to be a good dad.");
    			t22 = space();
    			p3 = element("p");
    			span2 = element("span");
    			span2.textContent = "For fun";
    			t24 = text(", I\n      ");
    			a7 = element("a");
    			a7.textContent = "golf";
    			t26 = text(", gamble,\n      ");
    			a8 = element("a");
    			a8.textContent = "read";
    			t28 = text(", stay fit via the\n      ");
    			a9 = element("a");
    			a9.textContent = "Daily Verkout";
    			t30 = text(", and build\n      things like\n      ");
    			a10 = element("a");
    			a10.textContent = "AirFryMe";
    			t32 = text("\n      and\n      ");
    			a11 = element("a");
    			a11.textContent = "Tulaga";
    			t34 = text(".");
    			t35 = space();
    			p4 = element("p");
    			span3 = element("span");
    			span3.textContent = "Please follow me";
    			t37 = text(" on\n      ");
    			a12 = element("a");
    			a12.textContent = "TikTok";
    			t39 = text(",\n      ");
    			a13 = element("a");
    			a13.textContent = "YouTube";
    			t41 = text(",\n      ");
    			a14 = element("a");
    			a14.textContent = "Instagram";
    			t43 = text(",\n      and\n      ");
    			a15 = element("a");
    			a15.textContent = "Twitter";
    			t45 = text(".\n      Connect on\n      ");
    			a16 = element("a");
    			a16.textContent = "LinkedIn";
    			t47 = text(".\n      Otherwise, brian.dainton (gmail).");
    			t48 = space();
    			p5 = element("p");
    			p5.textContent = "🤜💥🤛";
    			attr_dev(img, "class", "rounded-full border border-lightGray p-2 w-48 h-48 m-2 shadow-2xl");
    			if (!src_url_equal(img.src, img_src_value = "/assets/img/brian-color.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Brian Dainton Profile Picture");
    			attr_dev(img, "title", "Brian Dainton Profile Picture");
    			add_location(img, file$8, 4, 8, 214);
    			attr_dev(a0, "href", "/assets/img/brian-color.png");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$8, 3, 6, 151);
    			attr_dev(h1, "class", "font-rock-salt font-bold text-red100 text-center text-5xl -mt-8 pb-16");
    			add_location(h1, file$8, 11, 6, 469);
    			attr_dev(div0, "class", "flex flex-col content-center items-center");
    			add_location(div0, file$8, 2, 4, 89);
    			attr_dev(header, "class", "max-w-screen-md mx-auto");
    			add_location(header, file$8, 1, 2, 44);
    			attr_dev(span0, "class", "font-bold");
    			add_location(span0, file$8, 20, 6, 686);
    			attr_dev(a1, "href", "./coaching.html");
    			add_location(a1, file$8, 21, 6, 737);
    			add_location(p0, file$8, 19, 4, 676);
    			attr_dev(a2, "href", "https://verkout.com");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$8, 25, 17, 875);
    			add_location(p1, file$8, 24, 4, 854);
    			attr_dev(span1, "class", "font-bold");
    			add_location(span1, file$8, 30, 6, 1012);
    			attr_dev(a3, "href", "https://linkedin.com/in/bdainton");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$8, 31, 6, 1067);
    			attr_dev(a4, "href", "https://linkedin.com/in/bdainton");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file$8, 35, 6, 1191);
    			attr_dev(a5, "href", "https://www.bizjournals.com/austin/blog/techflash/2015/01/spredfast-nabs-tech-emmy-after-helping-obama-in.html");
    			attr_dev(a5, "target", "_blank");
    			add_location(a5, file$8, 38, 6, 1303);
    			attr_dev(a6, "href", "https://cs.illinois.edu");
    			attr_dev(a6, "target", "_blank");
    			add_location(a6, file$8, 43, 6, 1553);
    			attr_dev(p2, "class", "pt-8");
    			add_location(p2, file$8, 29, 4, 989);
    			attr_dev(span2, "class", "font-bold");
    			add_location(span2, file$8, 48, 6, 1711);
    			attr_dev(a7, "href", "https://thegrint.com/hdcp_lookup/records/758239");
    			attr_dev(a7, "target", "_blank");
    			add_location(a7, file$8, 49, 6, 1759);
    			attr_dev(a8, "href", "https://www.goodreads.com/user/show/73589478-brian-dainton");
    			attr_dev(a8, "target", "_blank");
    			add_location(a8, file$8, 52, 6, 1873);
    			attr_dev(a9, "href", "https://verkout.com");
    			attr_dev(a9, "target", "_blank");
    			add_location(a9, file$8, 56, 6, 2014);
    			attr_dev(a10, "href", "https://airfryme.com");
    			attr_dev(a10, "target", "_blank");
    			add_location(a10, file$8, 58, 6, 2113);
    			attr_dev(a11, "href", "https://tulaga.com");
    			attr_dev(a11, "target", "_blank");
    			add_location(a11, file$8, 60, 6, 2189);
    			attr_dev(p3, "class", "pt-8");
    			add_location(p3, file$8, 47, 4, 1688);
    			attr_dev(span3, "class", "font-bold");
    			add_location(span3, file$8, 63, 6, 2282);
    			attr_dev(a12, "href", "https://tiktok.com/@bdainton");
    			attr_dev(a12, "target", "_blank");
    			add_location(a12, file$8, 64, 6, 2339);
    			attr_dev(a13, "href", "https://www.youtube.com/channel/UCgj_o7A2nikioh0J0ph7HBA");
    			attr_dev(a13, "target", "_blank");
    			add_location(a13, file$8, 65, 6, 2412);
    			attr_dev(a14, "href", "https://instagram.com/bdainton");
    			attr_dev(a14, "target", "_blank");
    			add_location(a14, file$8, 69, 6, 2537);
    			attr_dev(a15, "href", "https://twitter.com/bdainton");
    			attr_dev(a15, "target", "_blank");
    			add_location(a15, file$8, 71, 6, 2625);
    			attr_dev(a16, "href", "https://linkedin.com/in/bdainton");
    			attr_dev(a16, "target", "_blank");
    			add_location(a16, file$8, 73, 6, 2716);
    			attr_dev(p4, "class", "pt-8");
    			add_location(p4, file$8, 62, 4, 2259);
    			attr_dev(p5, "class", "pt-16 text-center");
    			add_location(p5, file$8, 76, 4, 2842);
    			attr_dev(div1, "class", "max-w-screen-md mx-auto text-lg");
    			add_location(div1, file$8, 18, 2, 626);
    			attr_dev(main, "class", "flex flex-col bg-white p-4");
    			add_location(main, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(main, t2);
    			append_dev(main, div1);
    			append_dev(div1, p0);
    			append_dev(p0, span0);
    			append_dev(p0, t4);
    			append_dev(p0, a1);
    			append_dev(p0, t6);
    			append_dev(div1, t7);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(p1, a2);
    			append_dev(p1, t10);
    			append_dev(div1, t11);
    			append_dev(div1, p2);
    			append_dev(p2, span1);
    			append_dev(p2, t13);
    			append_dev(p2, a3);
    			append_dev(p2, t15);
    			append_dev(p2, a4);
    			append_dev(p2, t17);
    			append_dev(p2, a5);
    			append_dev(p2, t19);
    			append_dev(p2, a6);
    			append_dev(p2, t21);
    			append_dev(div1, t22);
    			append_dev(div1, p3);
    			append_dev(p3, span2);
    			append_dev(p3, t24);
    			append_dev(p3, a7);
    			append_dev(p3, t26);
    			append_dev(p3, a8);
    			append_dev(p3, t28);
    			append_dev(p3, a9);
    			append_dev(p3, t30);
    			append_dev(p3, a10);
    			append_dev(p3, t32);
    			append_dev(p3, a11);
    			append_dev(p3, t34);
    			append_dev(div1, t35);
    			append_dev(div1, p4);
    			append_dev(p4, span3);
    			append_dev(p4, t37);
    			append_dev(p4, a12);
    			append_dev(p4, t39);
    			append_dev(p4, a13);
    			append_dev(p4, t41);
    			append_dev(p4, a14);
    			append_dev(p4, t43);
    			append_dev(p4, a15);
    			append_dev(p4, t45);
    			append_dev(p4, a16);
    			append_dev(p4, t47);
    			append_dev(div1, t48);
    			append_dev(div1, p5);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IndexPage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IndexPage> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class IndexPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IndexPage",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/CoachingPage.svelte generated by Svelte v3.46.4 */

    const file$7 = "src/CoachingPage.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let header;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let h1;
    	let t2;
    	let h20;
    	let t4;
    	let h21;
    	let a1;
    	let t6;
    	let a2;
    	let t8;
    	let a3;
    	let t10;
    	let a4;
    	let t12;
    	let div10;
    	let div9;
    	let a5;
    	let span0;
    	let br0;
    	let t14;
    	let div8;
    	let div1;
    	let a6;
    	let img1;
    	let img1_src_value;
    	let t15;
    	let div2;
    	let a7;
    	let img2;
    	let img2_src_value;
    	let t16;
    	let div3;
    	let a8;
    	let img3;
    	let img3_src_value;
    	let t17;
    	let div4;
    	let a9;
    	let img4;
    	let img4_src_value;
    	let t18;
    	let div5;
    	let a10;
    	let img5;
    	let img5_src_value;
    	let t19;
    	let div6;
    	let a11;
    	let img6;
    	let img6_src_value;
    	let t20;
    	let div7;
    	let a12;
    	let img7;
    	let img7_src_value;
    	let t21;
    	let p0;
    	let a13;
    	let span1;
    	let br1;
    	let t23;
    	let br2;
    	let br3;
    	let t24;
    	let t25;
    	let p1;
    	let a14;
    	let t27;
    	let p2;
    	let a15;
    	let span2;
    	let t29;
    	let br4;
    	let t30;
    	let t31;
    	let p3;
    	let t33;
    	let p4;
    	let a16;
    	let span3;
    	let br5;
    	let t35;
    	let br6;
    	let br7;
    	let t36;
    	let a17;
    	let t38;
    	let a18;
    	let t40;
    	let t41;
    	let p5;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Brian Dainton";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Engineering Leadership Coaching";
    			t4 = space();
    			h21 = element("h2");
    			a1 = element("a");
    			a1.textContent = "Books";
    			t6 = text(" |\n        ");
    			a2 = element("a");
    			a2.textContent = "1-on-1";
    			t8 = text(" |\n        ");
    			a3 = element("a");
    			a3.textContent = "Companion";
    			t10 = text(" |\n        ");
    			a4 = element("a");
    			a4.textContent = "Videos";
    			t12 = space();
    			div10 = element("div");
    			div9 = element("div");
    			a5 = element("a");
    			span0 = element("span");
    			span0.textContent = "Books";
    			br0 = element("br");
    			t14 = text("\n      These are some of my favorites in the management and leadership domain.\n\n      ");
    			div8 = element("div");
    			div1 = element("div");
    			a6 = element("a");
    			img1 = element("img");
    			t15 = space();
    			div2 = element("div");
    			a7 = element("a");
    			img2 = element("img");
    			t16 = space();
    			div3 = element("div");
    			a8 = element("a");
    			img3 = element("img");
    			t17 = space();
    			div4 = element("div");
    			a9 = element("a");
    			img4 = element("img");
    			t18 = space();
    			div5 = element("div");
    			a10 = element("a");
    			img5 = element("img");
    			t19 = space();
    			div6 = element("div");
    			a11 = element("a");
    			img6 = element("img");
    			t20 = space();
    			div7 = element("div");
    			a12 = element("a");
    			img7 = element("img");
    			t21 = space();
    			p0 = element("p");
    			a13 = element("a");
    			span1 = element("span");
    			span1.textContent = "Weekly 1-on-1 Coaching";
    			br1 = element("br");
    			t23 = text("\n      For a monthly fee, we'll go deep on the leadership challenges you're encountering\n      in your day-to-day.");
    			br2 = element("br");
    			br3 = element("br");
    			t24 = text("\n      I'll offer practical guidance that you can apply immediately, all in pursuit\n      of the personalized goals we've set.");
    			t25 = space();
    			p1 = element("p");
    			a14 = element("a");
    			a14.textContent = "Apply here >>";
    			t27 = space();
    			p2 = element("p");
    			a15 = element("a");
    			span2 = element("span");
    			span2.textContent = "The Engineering Manager's Companion";
    			t29 = text("\n      (COMING SOON)");
    			br4 = element("br");
    			t30 = text("\n      Whether you're running a software engineering organization of 3 or 300, managing\n      and leading a dev team is tough.");
    			t31 = space();
    			p3 = element("p");
    			p3.textContent = "This ever-expanding video Companion distills my decades of experience into\n      a simple framework for approaching and successfully navigating the\n      challenges of software engineering management and leadership.";
    			t33 = space();
    			p4 = element("p");
    			a16 = element("a");
    			span3 = element("span");
    			span3.textContent = "Free Videos (YouTube + TikTok)";
    			br5 = element("br");
    			t35 = text("\n      Want some free, bite-sized content capturing my thoughts on software engineering\n      management and leadership?\n      ");
    			br6 = element("br");
    			br7 = element("br");
    			t36 = text("\n      Binge away on\n      ");
    			a17 = element("a");
    			a17.textContent = "YouTube";
    			t38 = text("\n      and ");
    			a18 = element("a");
    			a18.textContent = "TikTok";
    			t40 = text(".");
    			t41 = space();
    			p5 = element("p");
    			p5.textContent = "🤜💥🤛";
    			attr_dev(img0, "class", "rounded-full border border-lightGray p-2 w-48 h-48 m-2 shadow-2xl");
    			if (!src_url_equal(img0.src, img0_src_value = "/assets/img/brian-color.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Brian Dainton Profile Picture");
    			attr_dev(img0, "title", "Brian Dainton Profile Picture");
    			add_location(img0, file$7, 4, 8, 181);
    			attr_dev(a0, "href", "index.html");
    			add_location(a0, file$7, 3, 6, 151);
    			attr_dev(h1, "class", "font-rock-salt font-bold text-red100 text-5xl -mt-8 pb-16");
    			add_location(h1, file$7, 11, 6, 436);
    			attr_dev(h20, "class", "text-black -mt-12 text-xl");
    			add_location(h20, file$7, 14, 6, 547);
    			attr_dev(a1, "href", "#books");
    			add_location(a1, file$7, 16, 8, 672);
    			attr_dev(a2, "href", "#1-on-1");
    			add_location(a2, file$7, 17, 8, 709);
    			attr_dev(a3, "href", "#companion");
    			add_location(a3, file$7, 18, 8, 748);
    			attr_dev(a4, "href", "#videos");
    			add_location(a4, file$7, 19, 8, 793);
    			attr_dev(h21, "class", "text-lightGray text-lg");
    			add_location(h21, file$7, 15, 6, 628);
    			attr_dev(div0, "class", "flex flex-col content-center items-center");
    			add_location(div0, file$7, 2, 4, 89);
    			attr_dev(header, "class", "max-w-screen-md mx-auto");
    			add_location(header, file$7, 1, 2, 44);
    			attr_dev(a5, "name", "books");
    			add_location(a5, file$7, 26, 6, 937);
    			attr_dev(span0, "class", "font-bold");
    			add_location(span0, file$7, 26, 24, 955);
    			add_location(br0, file$7, 26, 60, 991);
    			attr_dev(img1, "border", "0");
    			if (!src_url_equal(img1.src, img1_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file$7, 34, 13, 1393);
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a6, file$7, 31, 10, 1143);
    			attr_dev(div1, "class", "p-2 pl-0");
    			add_location(div1, file$7, 30, 8, 1110);
    			attr_dev(img2, "border", "0");
    			if (!src_url_equal(img2.src, img2_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=1491973897&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file$7, 44, 13, 1935);
    			attr_dev(a7, "target", "_blank");
    			attr_dev(a7, "href", "https://www.amazon.com/gp/product/1491973897/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1491973897&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a7, file$7, 41, 10, 1685);
    			attr_dev(div2, "class", "p-2");
    			add_location(div2, file$7, 40, 8, 1657);
    			attr_dev(img3, "border", "0");
    			if (!src_url_equal(img3.src, img3_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0787960756&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file$7, 54, 13, 2477);
    			attr_dev(a8, "target", "_blank");
    			attr_dev(a8, "href", "https://www.amazon.com/gp/product/0787960756/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0787960756&linkCode=as2&tag=briandainton-20&linkId=10d9f2cfb2d59d17c4185221adf24f98");
    			add_location(a8, file$7, 51, 10, 2227);
    			attr_dev(div3, "class", "p-2");
    			add_location(div3, file$7, 50, 8, 2199);
    			attr_dev(img4, "border", "0");
    			if (!src_url_equal(img4.src, img4_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062407805&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file$7, 64, 13, 3019);
    			attr_dev(a9, "target", "_blank");
    			attr_dev(a9, "href", "https://www.amazon.com/gp/product/0062407805/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062407805&linkCode=as2&tag=briandainton-20&linkId=6e5eb2a895b239752443681028093f8d");
    			add_location(a9, file$7, 61, 10, 2769);
    			attr_dev(div4, "class", "p-2");
    			add_location(div4, file$7, 60, 8, 2741);
    			attr_dev(img5, "border", "0");
    			if (!src_url_equal(img5.src, img5_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=1250235375&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img5, "src", img5_src_value);
    			add_location(img5, file$7, 74, 13, 3561);
    			attr_dev(a10, "target", "_blank");
    			attr_dev(a10, "href", "https://www.amazon.com/gp/product/1250235375/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1250235375&linkCode=as2&tag=briandainton-20&linkId=266959065d24b2beebd6112682c92b8c");
    			add_location(a10, file$7, 71, 10, 3311);
    			attr_dev(div5, "class", "p-2");
    			add_location(div5, file$7, 70, 8, 3283);
    			attr_dev(img6, "border", "0");
    			if (!src_url_equal(img6.src, img6_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=1484221575&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img6, "src", img6_src_value);
    			add_location(img6, file$7, 84, 13, 4103);
    			attr_dev(a11, "target", "_blank");
    			attr_dev(a11, "href", "https://www.amazon.com/gp/product/1484221575/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1484221575&linkCode=as2&tag=briandainton-20&linkId=dba3c208c3a5175c02e10ec2dd918b95");
    			add_location(a11, file$7, 81, 10, 3853);
    			attr_dev(div6, "class", "p-2");
    			add_location(div6, file$7, 80, 8, 3825);
    			attr_dev(img7, "border", "0");
    			if (!src_url_equal(img7.src, img7_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0312430000&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img7, "src", img7_src_value);
    			add_location(img7, file$7, 94, 13, 4645);
    			attr_dev(a12, "target", "_blank");
    			attr_dev(a12, "href", "https://www.amazon.com/gp/product/0312430000/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0312430000&linkCode=as2&tag=briandainton-20&linkId=da0fdc46572eef1154a418dd146a8095");
    			add_location(a12, file$7, 91, 10, 4395);
    			attr_dev(div7, "class", "p-2");
    			add_location(div7, file$7, 90, 8, 4367);
    			attr_dev(div8, "class", "flex");
    			add_location(div8, file$7, 29, 6, 1083);
    			attr_dev(div9, "class", "");
    			add_location(div9, file$7, 25, 4, 916);
    			attr_dev(a13, "name", "1-on-1");
    			add_location(a13, file$7, 104, 6, 4953);
    			attr_dev(span1, "class", "font-bold");
    			add_location(span1, file$7, 104, 25, 4972);
    			add_location(br1, file$7, 105, 7, 5032);
    			add_location(br2, file$7, 107, 25, 5152);
    			add_location(br3, file$7, 107, 31, 5158);
    			attr_dev(p0, "class", "pt-8");
    			add_location(p0, file$7, 103, 4, 4930);
    			attr_dev(a14, "href", "https://docs.google.com/forms/d/e/1FAIpQLSehd1Lpd7NXL07gfuD9jCulQGQPlF7CfxakYl_NOyWPAloa3Q/viewform?usp=sf_link");
    			attr_dev(a14, "target", "_blank");
    			add_location(a14, file$7, 112, 6, 5314);
    			add_location(p1, file$7, 111, 4, 5304);
    			attr_dev(a15, "name", "companion");
    			add_location(a15, file$7, 119, 6, 5530);
    			attr_dev(span2, "class", "font-bold");
    			add_location(span2, file$7, 119, 28, 5552);
    			add_location(br4, file$7, 122, 19, 5654);
    			attr_dev(p2, "class", "pt-8");
    			add_location(p2, file$7, 118, 4, 5507);
    			add_location(p3, file$7, 126, 4, 5800);
    			attr_dev(a16, "name", "videos");
    			add_location(a16, file$7, 133, 6, 6083);
    			attr_dev(span3, "class", "font-bold");
    			add_location(span3, file$7, 133, 25, 6102);
    			add_location(br5, file$7, 135, 7, 6179);
    			add_location(br6, file$7, 138, 6, 6312);
    			add_location(br7, file$7, 138, 12, 6318);
    			attr_dev(a17, "target", "_blank");
    			attr_dev(a17, "href", "https://www.youtube.com/channel/UCgj_o7A2nikioh0J0ph7HBA");
    			add_location(a17, file$7, 140, 6, 6351);
    			attr_dev(a18, "target", "_blank");
    			attr_dev(a18, "href", "https://tiktok.com/@bdainton");
    			add_location(a18, file$7, 145, 10, 6488);
    			attr_dev(p4, "class", "pt-8");
    			set_style(p4, "clear", "both");
    			add_location(p4, file$7, 132, 4, 6040);
    			attr_dev(p5, "class", "pt-16 text-center");
    			add_location(p5, file$7, 148, 4, 6569);
    			attr_dev(div10, "class", "max-w-screen-md mx-auto text-lg pt-12");
    			add_location(div10, file$7, 24, 2, 860);
    			attr_dev(main, "class", "flex flex-col bg-white p-4");
    			add_location(main, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			append_dev(div0, h20);
    			append_dev(div0, t4);
    			append_dev(div0, h21);
    			append_dev(h21, a1);
    			append_dev(h21, t6);
    			append_dev(h21, a2);
    			append_dev(h21, t8);
    			append_dev(h21, a3);
    			append_dev(h21, t10);
    			append_dev(h21, a4);
    			append_dev(main, t12);
    			append_dev(main, div10);
    			append_dev(div10, div9);
    			append_dev(div9, a5);
    			append_dev(div9, span0);
    			append_dev(div9, br0);
    			append_dev(div9, t14);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, a6);
    			append_dev(a6, img1);
    			append_dev(div8, t15);
    			append_dev(div8, div2);
    			append_dev(div2, a7);
    			append_dev(a7, img2);
    			append_dev(div8, t16);
    			append_dev(div8, div3);
    			append_dev(div3, a8);
    			append_dev(a8, img3);
    			append_dev(div8, t17);
    			append_dev(div8, div4);
    			append_dev(div4, a9);
    			append_dev(a9, img4);
    			append_dev(div8, t18);
    			append_dev(div8, div5);
    			append_dev(div5, a10);
    			append_dev(a10, img5);
    			append_dev(div8, t19);
    			append_dev(div8, div6);
    			append_dev(div6, a11);
    			append_dev(a11, img6);
    			append_dev(div8, t20);
    			append_dev(div8, div7);
    			append_dev(div7, a12);
    			append_dev(a12, img7);
    			append_dev(div10, t21);
    			append_dev(div10, p0);
    			append_dev(p0, a13);
    			append_dev(p0, span1);
    			append_dev(p0, br1);
    			append_dev(p0, t23);
    			append_dev(p0, br2);
    			append_dev(p0, br3);
    			append_dev(p0, t24);
    			append_dev(div10, t25);
    			append_dev(div10, p1);
    			append_dev(p1, a14);
    			append_dev(div10, t27);
    			append_dev(div10, p2);
    			append_dev(p2, a15);
    			append_dev(p2, span2);
    			append_dev(p2, t29);
    			append_dev(p2, br4);
    			append_dev(p2, t30);
    			append_dev(div10, t31);
    			append_dev(div10, p3);
    			append_dev(div10, t33);
    			append_dev(div10, p4);
    			append_dev(p4, a16);
    			append_dev(p4, span3);
    			append_dev(p4, br5);
    			append_dev(p4, t35);
    			append_dev(p4, br6);
    			append_dev(p4, br7);
    			append_dev(p4, t36);
    			append_dev(p4, a17);
    			append_dev(p4, t38);
    			append_dev(p4, a18);
    			append_dev(p4, t40);
    			append_dev(div10, t41);
    			append_dev(div10, p5);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CoachingPage', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CoachingPage> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class CoachingPage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CoachingPage",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/BuyButton.svelte generated by Svelte v3.46.4 */

    const file$6 = "src/components/BuyButton.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let div_id_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "id", div_id_value = "product-component-" + /*elementId*/ ctx[0]);
    			add_location(div, file$6, 156, 0, 4737);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*elementId*/ 1 && div_id_value !== (div_id_value = "product-component-" + /*elementId*/ ctx[0])) {
    				attr_dev(div, "id", div_id_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BuyButton', slots, []);
    	let { buttonText = "foobar" } = $$props;
    	let { elementId = "1656390870201" } = $$props;

    	/*<![CDATA[*/
    	(function () {
    		var scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    		if (window.ShopifyBuy) {
    			if (window.ShopifyBuy.UI) {
    				ShopifyBuyInit();
    			} else {
    				loadScript();
    			}
    		} else {
    			loadScript();
    		}

    		function loadScript() {
    			var script = document.createElement("script");
    			script.async = true;
    			script.src = scriptURL;
    			(document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(script);
    			script.onload = ShopifyBuyInit;
    		}

    		function ShopifyBuyInit() {
    			var client = ShopifyBuy.buildClient({
    				domain: "briandainton.myshopify.com",
    				storefrontAccessToken: "9f05f285e8150de4a4b442c604382d08"
    			});

    			ShopifyBuy.UI.onReady(client).then(function (ui) {
    				ui.createComponent("product", {
    					id: "6780498346057",
    					node: document.getElementById("product-component-" + elementId),
    					moneyFormat: "%24%7B%7Bamount%7D%7D",
    					options: {
    						product: {
    							styles: {
    								product: {
    									"@media (min-width: 601px)": {
    										"max-width": "calc(25% - 20px)",
    										"margin-left": "20px",
    										"margin-bottom": "50px"
    									}
    								},
    								button: {
    									"font-family": "Roboto, sans-serif",
    									":hover": { "background-color": "#ff0000" },
    									"background-color": "#d20000",
    									":focus": { "background-color": "#ff0000" },
    									"border-radius": "10px",
    									"margin-top": "-20px !important"
    								}
    							},
    							buttonDestination: "checkout",
    							contents: { img: false, title: false, price: false },
    							text: { button: buttonText },
    							googleFonts: ["Roboto"]
    						},
    						productSet: {
    							styles: {
    								products: {
    									"@media (min-width: 601px)": { "margin-left": "-20px" }
    								}
    							}
    						},
    						modalProduct: {
    							contents: {
    								img: false,
    								imgWithCarousel: true,
    								button: false,
    								buttonWithQuantity: true
    							},
    							styles: {
    								product: {
    									"@media (min-width: 601px)": {
    										"max-width": "100%",
    										"margin-left": "0px",
    										"margin-bottom": "0px"
    									}
    								},
    								button: {
    									"font-family": "Roboto, sans-serif",
    									":hover": { "background-color": "#ff0000" },
    									"background-color": "#d20000",
    									":focus": { "background-color": "#ff0000" },
    									"border-radius": "15px"
    								}
    							},
    							googleFonts: ["Roboto"],
    							text: { button: "Add to cart" }
    						},
    						option: {},
    						cart: {
    							styles: {
    								button: {
    									"font-family": "Roboto, sans-serif",
    									":hover": { "background-color": "#ff0000" },
    									"background-color": "#d20000",
    									":focus": { "background-color": "#ff0000" },
    									"border-radius": "15px"
    								}
    							},
    							text: { total: "Subtotal", button: "Checkout" },
    							googleFonts: ["Roboto"]
    						},
    						toggle: {
    							styles: {
    								toggle: {
    									"font-family": "Roboto, sans-serif",
    									"background-color": "#d20000",
    									":hover": { "background-color": "#ff0000" },
    									":focus": { "background-color": "#ff0000" }
    								}
    							},
    							googleFonts: ["Roboto"]
    						}
    					}
    				});
    			});
    		}
    	})();

    	const writable_props = ['buttonText', 'elementId'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BuyButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('buttonText' in $$props) $$invalidate(1, buttonText = $$props.buttonText);
    		if ('elementId' in $$props) $$invalidate(0, elementId = $$props.elementId);
    	};

    	$$self.$capture_state = () => ({ buttonText, elementId });

    	$$self.$inject_state = $$props => {
    		if ('buttonText' in $$props) $$invalidate(1, buttonText = $$props.buttonText);
    		if ('elementId' in $$props) $$invalidate(0, elementId = $$props.elementId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [elementId, buttonText];
    }

    class BuyButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { buttonText: 1, elementId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BuyButton",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get buttonText() {
    		throw new Error("<BuyButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonText(value) {
    		throw new Error("<BuyButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elementId() {
    		throw new Error("<BuyButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elementId(value) {
    		throw new Error("<BuyButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Icon.svelte generated by Svelte v3.46.4 */

    const file$5 = "src/components/Icon.svelte";

    // (204:29) 
    function create_if_block_10$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17 8.99994C17 8.48812 16.8047 7.9763 16.4142 7.58579C16.0237 7.19526 15.5118 7 15 7M15 15C18.3137 15 21 12.3137 21 9C21 5.68629 18.3137 3 15 3C11.6863 3 9 5.68629 9 9C9 9.27368 9.01832 9.54308 9.05381 9.80704C9.11218 10.2412 9.14136 10.4583 9.12172 10.5956C9.10125 10.7387 9.0752 10.8157 9.00469 10.9419C8.937 11.063 8.81771 11.1823 8.57913 11.4209L3.46863 16.5314C3.29568 16.7043 3.2092 16.7908 3.14736 16.8917C3.09253 16.9812 3.05213 17.0787 3.02763 17.1808C3 17.2959 3 17.4182 3 17.6627V19.4C3 19.9601 3 20.2401 3.10899 20.454C3.20487 20.6422 3.35785 20.7951 3.54601 20.891C3.75992 21 4.03995 21 4.6 21H7V19H9V17H11L12.5791 15.4209C12.8177 15.1823 12.937 15.063 13.0581 14.9953C13.1843 14.9248 13.2613 14.8987 13.4044 14.8783C13.5417 14.8586 13.7588 14.8878 14.193 14.9462C14.4569 14.9817 14.7263 15 15 15Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 212, 4, 9179);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 204, 2, 9033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(204:29) ",
    		ctx
    	});

    	return block;
    }

    // (187:26) 
    function create_if_block_9$1(ctx) {
    	let svg;
    	let path;
    	let svg_width_value;
    	let svg_height_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M17 10V8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8V10M12 14.5V16.5M8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C17.7202 10 16.8802 10 15.2 10H8.8C7.11984 10 6.27976 10 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 195, 4, 8316);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", svg_width_value = /*width*/ ctx[4] || 24);
    			attr_dev(svg, "height", svg_height_value = /*height*/ ctx[5] || 24);
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 187, 2, 8151);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 16 && svg_width_value !== (svg_width_value = /*width*/ ctx[4] || 24)) {
    				attr_dev(svg, "width", svg_width_value);
    			}

    			if (dirty & /*height*/ 32 && svg_height_value !== (svg_height_value = /*height*/ ctx[5] || 24)) {
    				attr_dev(svg, "height", svg_height_value);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(187:26) ",
    		ctx
    	});

    	return block;
    }

    // (170:26) 
    function create_if_block_8$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M5 4.98951C5 4.01835 5 3.53277 5.20249 3.2651C5.37889 3.03191 5.64852 2.88761 5.9404 2.87018C6.27544 2.85017 6.67946 3.11953 7.48752 3.65823L18.0031 10.6686C18.6708 11.1137 19.0046 11.3363 19.1209 11.6168C19.2227 11.8621 19.2227 12.1377 19.1209 12.383C19.0046 12.6635 18.6708 12.886 18.0031 13.3312L7.48752 20.3415C6.67946 20.8802 6.27544 21.1496 5.9404 21.1296C5.64852 21.1122 5.37889 20.9679 5.20249 20.7347C5 20.467 5 19.9814 5 19.0103V4.98951Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 178, 4, 7535);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 170, 2, 7389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(170:26) ",
    		ctx
    	});

    	return block;
    }

    // (153:26) 
    function create_if_block_7$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M21 12L9 12M21 6L9 6M21 18L9 18M5 12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11C4.55228 11 5 11.4477 5 12ZM5 6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5C4.55228 5 5 5.44772 5 6ZM5 18C5 18.5523 4.55228 19 4 19C3.44772 19 3 18.5523 3 18C3 17.4477 3.44772 17 4 17C4.55228 17 5 17.4477 5 18Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 161, 4, 6868);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 153, 2, 6722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(153:26) ",
    		ctx
    	});

    	return block;
    }

    // (137:27) 
    function create_if_block_6$1(ctx) {
    	let svg;
    	let circle;
    	let path;
    	let line;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			path = svg_element("path");
    			line = svg_element("line");
    			attr_dev(circle, "cx", "12");
    			attr_dev(circle, "cy", "12");
    			attr_dev(circle, "r", "10");
    			add_location(circle, file$5, 148, 5, 6548);
    			attr_dev(path, "d", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3");
    			add_location(path, file$5, 148, 38, 6581);
    			attr_dev(line, "x1", "12");
    			attr_dev(line, "y1", "17");
    			attr_dev(line, "x2", "12.01");
    			attr_dev(line, "y2", "17");
    			add_location(line, file$5, 150, 6, 6640);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "22");
    			attr_dev(svg, "height", "22");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			attr_dev(svg, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			add_location(svg, file$5, 137, 2, 6306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    			append_dev(svg, path);
    			append_dev(svg, line);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}

    			if (dirty & /*stroke*/ 2) {
    				attr_dev(svg, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(svg, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(137:27) ",
    		ctx
    	});

    	return block;
    }

    // (120:31) 
    function create_if_block_5$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M7.5 4.5C7.5 3.11929 8.61929 2 10 2C11.3807 2 12.5 3.11929 12.5 4.5V6H13.5C14.8978 6 15.5967 6 16.1481 6.22836C16.8831 6.53284 17.4672 7.11687 17.7716 7.85195C18 8.40326 18 9.10218 18 10.5H19.5C20.8807 10.5 22 11.6193 22 13C22 14.3807 20.8807 15.5 19.5 15.5H18V17.2C18 18.8802 18 19.7202 17.673 20.362C17.3854 20.9265 16.9265 21.3854 16.362 21.673C15.7202 22 14.8802 22 13.2 22H12.5V20.25C12.5 19.0074 11.4926 18 10.25 18C9.00736 18 8 19.0074 8 20.25V22H6.8C5.11984 22 4.27976 22 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V15.5H3.5C4.88071 15.5 6 14.3807 6 13C6 11.6193 4.88071 10.5 3.5 10.5H2C2 9.10218 2 8.40326 2.22836 7.85195C2.53284 7.11687 3.11687 6.53284 3.85195 6.22836C4.40326 6 5.10218 6 6.5 6H7.5V4.5Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 128, 4, 5379);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 120, 2, 5233);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(120:31) ",
    		ctx
    	});

    	return block;
    }

    // (103:29) 
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 111, 4, 4571);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 103, 2, 4425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(103:29) ",
    		ctx
    	});

    	return block;
    }

    // (79:29) 
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M20.5 7.27783L12 12.0001M12 12.0001L3.49997 7.27783M12 12.0001L12 21.5001M21 16.0586V7.94153C21 7.59889 21 7.42757 20.9495 7.27477C20.9049 7.13959 20.8318 7.01551 20.7354 6.91082C20.6263 6.79248 20.4766 6.70928 20.177 6.54288L12.777 2.43177C12.4934 2.27421 12.3516 2.19543 12.2015 2.16454C12.0685 2.13721 11.9315 2.13721 11.7986 2.16454C11.6484 2.19543 11.5066 2.27421 11.223 2.43177L3.82297 6.54288C3.52345 6.70928 3.37369 6.79248 3.26463 6.91082C3.16816 7.01551 3.09515 7.13959 3.05048 7.27477C3 7.42757 3 7.59889 3 7.94153V16.0586C3 16.4013 3 16.5726 3.05048 16.7254C3.09515 16.8606 3.16816 16.9847 3.26463 17.0893C3.37369 17.2077 3.52345 17.2909 3.82297 17.4573L11.223 21.5684C11.5066 21.726 11.6484 21.8047 11.7986 21.8356C11.9315 21.863 12.0685 21.863 12.2015 21.8356C12.3516 21.8047 12.4934 21.726 12.777 21.5684L20.177 17.4573C20.4766 17.2909 20.6263 17.2077 20.7354 17.0893C20.8318 16.9847 20.9049 16.8606 20.9495 16.7254C21 16.5726 21 16.4013 21 16.0586Z");
    			attr_dev(path0, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			add_location(path0, file$5, 87, 4, 3137);
    			attr_dev(path1, "d", "M16.5 9.5L7.5 4.5");
    			attr_dev(path1, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path1, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			add_location(path1, file$5, 94, 4, 4236);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 79, 2, 2991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path0, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path1, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path1, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(79:29) ",
    		ctx
    	});

    	return block;
    }

    // (62:28) 
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M22 21V19C22 17.1362 20.7252 15.5701 19 15.126M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M17 21C17 19.1362 17 18.2044 16.6955 17.4693C16.2895 16.4892 15.5108 15.7105 14.5307 15.3045C13.7956 15 12.8638 15 11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 70, 4, 2329);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 62, 2, 2183);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(62:28) ",
    		ctx
    	});

    	return block;
    }

    // (27:31) 
    function create_if_block_1$1(ctx) {
    	let svg;
    	let g;
    	let path0;
    	let path1;
    	let path2;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "id", "svg_1");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path0, "d", "m11.87497,15.75c3.866,0 7,-3.134 7,-7c0,-3.86599 -3.134,-7 -7,-7c-3.86599,0 -7,3.13401 -7,7c0,3.866 3.13401,7 7,7z");
    			add_location(path0, file$5, 35, 6, 1306);
    			attr_dev(path1, "id", "svg_2");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path1, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path1, "d", "m15.62499,21.8125c3.866,0 7,-3.134 7,-7c0,-3.866 -3.134,-7 -7,-7c-3.866,0 -7,3.134 -7,7c0,3.866 3.134,7 7,7z");
    			add_location(path1, file$5, 43, 6, 1588);
    			attr_dev(path2, "id", "svg_3");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path2, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path2, "d", "m8.43756,21.81251c3.866,0 7,-3.134 7,-7c0,-3.866 -3.134,-7 -7,-7c-3.866,0 -7,3.134 -7,7c0,3.866 3.134,7 7,7z");
    			add_location(path2, file$5, 51, 6, 1864);
    			add_location(g, file$5, 34, 4, 1296);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 27, 2, 1174);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(g, path2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path0, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path1, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path1, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path2, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path2, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(27:31) ",
    		ctx
    	});

    	return block;
    }

    // (10:0) {#if name === "home"}
    function create_if_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M3 10.5651C3 9.9907 3 9.70352 3.07403 9.43905C3.1396 9.20478 3.24737 8.98444 3.39203 8.78886C3.55534 8.56806 3.78202 8.39175 4.23539 8.03912L11.0177 2.764C11.369 2.49075 11.5447 2.35412 11.7387 2.3016C11.9098 2.25526 12.0902 2.25526 12.2613 2.3016C12.4553 2.35412 12.631 2.49075 12.9823 2.764L19.7646 8.03913C20.218 8.39175 20.4447 8.56806 20.608 8.78886C20.7526 8.98444 20.8604 9.20478 20.926 9.43905C21 9.70352 21 9.9907 21 10.5651V17.8C21 18.9201 21 19.4801 20.782 19.908C20.5903 20.2843 20.2843 20.5903 19.908 20.782C19.4802 21 18.9201 21 17.8 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4801 3 18.9201 3 17.8V10.5651Z");
    			attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			add_location(path, file$5, 18, 4, 326);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			add_location(svg, file$5, 10, 2, 180);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*stroke*/ 2) {
    				attr_dev(path, "stroke", /*stroke*/ ctx[1]);
    			}

    			if (dirty & /*strokeWidth*/ 4) {
    				attr_dev(path, "stroke-width", /*strokeWidth*/ ctx[2]);
    			}

    			if (dirty & /*classNames*/ 1) {
    				attr_dev(svg, "class", /*classNames*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:0) {#if name === \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*name*/ ctx[3] === "home") return create_if_block$1;
    		if (/*name*/ ctx[3] === "framework") return create_if_block_1$1;
    		if (/*name*/ ctx[3] === "people") return create_if_block_2$1;
    		if (/*name*/ ctx[3] === "product") return create_if_block_3$1;
    		if (/*name*/ ctx[3] === "process") return create_if_block_4$1;
    		if (/*name*/ ctx[3] === "potpourri") return create_if_block_5$1;
    		if (/*name*/ ctx[3] === "about") return create_if_block_6$1;
    		if (/*name*/ ctx[3] === "list") return create_if_block_7$1;
    		if (/*name*/ ctx[3] === "play") return create_if_block_8$1;
    		if (/*name*/ ctx[3] === "lock") return create_if_block_9$1;
    		if (/*name*/ ctx[3] === "license") return create_if_block_10$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { classNames } = $$props;
    	let { stroke } = $$props;
    	let { strokeWidth = 2 } = $$props;
    	let { name } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	const writable_props = ['classNames', 'stroke', 'strokeWidth', 'name', 'width', 'height'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('classNames' in $$props) $$invalidate(0, classNames = $$props.classNames);
    		if ('stroke' in $$props) $$invalidate(1, stroke = $$props.stroke);
    		if ('strokeWidth' in $$props) $$invalidate(2, strokeWidth = $$props.strokeWidth);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('height' in $$props) $$invalidate(5, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({
    		classNames,
    		stroke,
    		strokeWidth,
    		name,
    		width,
    		height
    	});

    	$$self.$inject_state = $$props => {
    		if ('classNames' in $$props) $$invalidate(0, classNames = $$props.classNames);
    		if ('stroke' in $$props) $$invalidate(1, stroke = $$props.stroke);
    		if ('strokeWidth' in $$props) $$invalidate(2, strokeWidth = $$props.strokeWidth);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('height' in $$props) $$invalidate(5, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classNames, stroke, strokeWidth, name, width, height];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			classNames: 0,
    			stroke: 1,
    			strokeWidth: 2,
    			name: 3,
    			width: 4,
    			height: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*classNames*/ ctx[0] === undefined && !('classNames' in props)) {
    			console.warn("<Icon> was created without expected prop 'classNames'");
    		}

    		if (/*stroke*/ ctx[1] === undefined && !('stroke' in props)) {
    			console.warn("<Icon> was created without expected prop 'stroke'");
    		}

    		if (/*name*/ ctx[3] === undefined && !('name' in props)) {
    			console.warn("<Icon> was created without expected prop 'name'");
    		}

    		if (/*width*/ ctx[4] === undefined && !('width' in props)) {
    			console.warn("<Icon> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[5] === undefined && !('height' in props)) {
    			console.warn("<Icon> was created without expected prop 'height'");
    		}
    	}

    	get classNames() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNames(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/NavItem.svelte generated by Svelte v3.46.4 */

    const { console: console_1$2 } = globals;
    const file$4 = "src/components/NavItem.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let icon;
    	let t0;
    	let p;
    	let t1;
    	let p_class_value;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				name: /*iconName*/ ctx[2],
    				classNames: "",
    				stroke: /*color*/ ctx[8],
    				strokeWidth: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			p = element("p");
    			t1 = text(/*title*/ ctx[3]);
    			attr_dev(p, "class", p_class_value = "p-0 pl-" + (/*secondary*/ ctx[0] ? '16 text-sm' : '4 text-lg'));
    			add_location(p, file$4, 43, 2, 1261);
    			attr_dev(div, "class", div_class_value = "flex flex-row justify-items-start items-center p-2 pl-8 " + (/*secondary*/ ctx[0] ? 'py-0' : '') + " " + /*boldClass*/ ctx[5] + " mb-1 text-" + /*colorClass*/ ctx[7] + " rounded-r-lg border-solid border-0 border-l-4 border-" + /*borderColorClass*/ ctx[6] + " hover:bg-white cursor-pointer " + /*classes*/ ctx[4]);
    			add_location(div, file$4, 33, 0, 828);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const icon_changes = {};
    			if (dirty & /*iconName*/ 4) icon_changes.name = /*iconName*/ ctx[2];
    			if (dirty & /*color*/ 256) icon_changes.stroke = /*color*/ ctx[8];
    			icon.$set(icon_changes);
    			if (!current || dirty & /*title*/ 8) set_data_dev(t1, /*title*/ ctx[3]);

    			if (!current || dirty & /*secondary*/ 1 && p_class_value !== (p_class_value = "p-0 pl-" + (/*secondary*/ ctx[0] ? '16 text-sm' : '4 text-lg'))) {
    				attr_dev(p, "class", p_class_value);
    			}

    			if (!current || dirty & /*secondary, boldClass, colorClass, borderColorClass, classes*/ 241 && div_class_value !== (div_class_value = "flex flex-row justify-items-start items-center p-2 pl-8 " + (/*secondary*/ ctx[0] ? 'py-0' : '') + " " + /*boldClass*/ ctx[5] + " mb-1 text-" + /*colorClass*/ ctx[7] + " rounded-r-lg border-solid border-0 border-l-4 border-" + /*borderColorClass*/ ctx[6] + " hover:bg-white cursor-pointer " + /*classes*/ ctx[4])) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let color;
    	let colorClass;
    	let borderColorClass;
    	let boldClass;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavItem', slots, []);
    	let { secondary = false } = $$props;
    	let { active } = $$props;
    	let { name } = $$props;
    	let { iconName } = $$props;
    	let { title } = $$props;
    	let { onActivate } = $$props;
    	let { classes } = $$props;

    	// var inactiveColor = "#000000";
    	// var inactiveColorClass = "black";
    	var inactiveColor = "#575757";

    	var inactiveColorClass = "charcoal";
    	var activeColor = "#D20000";
    	var activeColorClass = "red100";

    	function onIconClick(section) {
    		console.log("onIconClick with section " + section);

    		if (onActivate) {
    			onActivate(section);
    		}
    	}

    	const writable_props = ['secondary', 'active', 'name', 'iconName', 'title', 'onActivate', 'classes'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<NavItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onIconClick(name);

    	$$self.$$set = $$props => {
    		if ('secondary' in $$props) $$invalidate(0, secondary = $$props.secondary);
    		if ('active' in $$props) $$invalidate(10, active = $$props.active);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('iconName' in $$props) $$invalidate(2, iconName = $$props.iconName);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('onActivate' in $$props) $$invalidate(11, onActivate = $$props.onActivate);
    		if ('classes' in $$props) $$invalidate(4, classes = $$props.classes);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		secondary,
    		active,
    		name,
    		iconName,
    		title,
    		onActivate,
    		classes,
    		inactiveColor,
    		inactiveColorClass,
    		activeColor,
    		activeColorClass,
    		onIconClick,
    		boldClass,
    		borderColorClass,
    		colorClass,
    		color
    	});

    	$$self.$inject_state = $$props => {
    		if ('secondary' in $$props) $$invalidate(0, secondary = $$props.secondary);
    		if ('active' in $$props) $$invalidate(10, active = $$props.active);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('iconName' in $$props) $$invalidate(2, iconName = $$props.iconName);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('onActivate' in $$props) $$invalidate(11, onActivate = $$props.onActivate);
    		if ('classes' in $$props) $$invalidate(4, classes = $$props.classes);
    		if ('inactiveColor' in $$props) $$invalidate(13, inactiveColor = $$props.inactiveColor);
    		if ('inactiveColorClass' in $$props) $$invalidate(14, inactiveColorClass = $$props.inactiveColorClass);
    		if ('activeColor' in $$props) $$invalidate(15, activeColor = $$props.activeColor);
    		if ('activeColorClass' in $$props) $$invalidate(16, activeColorClass = $$props.activeColorClass);
    		if ('boldClass' in $$props) $$invalidate(5, boldClass = $$props.boldClass);
    		if ('borderColorClass' in $$props) $$invalidate(6, borderColorClass = $$props.borderColorClass);
    		if ('colorClass' in $$props) $$invalidate(7, colorClass = $$props.colorClass);
    		if ('color' in $$props) $$invalidate(8, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*active*/ 1024) {
    			$$invalidate(8, color = active ? activeColor : inactiveColor);
    		}

    		if ($$self.$$.dirty & /*active*/ 1024) {
    			$$invalidate(7, colorClass = active ? activeColorClass : inactiveColorClass);
    		}

    		if ($$self.$$.dirty & /*active, secondary*/ 1025) {
    			$$invalidate(6, borderColorClass = active && !secondary ? activeColorClass : "transparent");
    		}

    		if ($$self.$$.dirty & /*active*/ 1024) {
    			$$invalidate(5, boldClass = active ? "font-bold" : "");
    		}
    	};

    	return [
    		secondary,
    		name,
    		iconName,
    		title,
    		classes,
    		boldClass,
    		borderColorClass,
    		colorClass,
    		color,
    		onIconClick,
    		active,
    		onActivate,
    		click_handler
    	];
    }

    class NavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			secondary: 0,
    			active: 10,
    			name: 1,
    			iconName: 2,
    			title: 3,
    			onActivate: 11,
    			classes: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavItem",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*active*/ ctx[10] === undefined && !('active' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'active'");
    		}

    		if (/*name*/ ctx[1] === undefined && !('name' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'name'");
    		}

    		if (/*iconName*/ ctx[2] === undefined && !('iconName' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'iconName'");
    		}

    		if (/*title*/ ctx[3] === undefined && !('title' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'title'");
    		}

    		if (/*onActivate*/ ctx[11] === undefined && !('onActivate' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'onActivate'");
    		}

    		if (/*classes*/ ctx[4] === undefined && !('classes' in props)) {
    			console_1$2.warn("<NavItem> was created without expected prop 'classes'");
    		}
    	}

    	get secondary() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondary(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconName() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconName(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onActivate() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onActivate(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error("<NavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error("<NavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/PremiumTag.svelte generated by Svelte v3.46.4 */

    const { console: console_1$1 } = globals;
    const file$3 = "src/components/PremiumTag.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let icon;
    	let t0;
    	let p;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				name: "lock",
    				classNames: "w-4 h-4",
    				stroke: "#ffffff",
    				strokeWidth: 1
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			p = element("p");
    			p.textContent = "Premium Content";
    			attr_dev(p, "class", "p-0 pl-2 text-sm text-white'}");
    			add_location(p, file$3, 30, 2, 893);
    			attr_dev(div, "class", "flex flex-row justify-items-start items-center p-2 px-4 text-white rounded-lg bg-red100 hover:shadow-lg cursor-pointer");
    			add_location(div, file$3, 22, 0, 605);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			append_dev(div, t0);
    			append_dev(div, p);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function onIconClick() {
    	console.log("on premium tag icon click");
    } // if (onActivate) {
    //   onActivate(section);

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PremiumTag', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<PremiumTag> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onIconClick();
    	$$self.$capture_state = () => ({ Icon, onIconClick });
    	return [click_handler];
    }

    class PremiumTag extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PremiumTag",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var dayjs_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=M;var p=function(t){return t instanceof _},S=function(t,e,n){var r;if(!t)return D;if("string"==typeof t)v[t]&&(r=t),e&&(v[t]=e,r=t);else {var i=t.name;v[i]=t,r=i;}return !n&&r&&(D=r),r||!n&&D},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var D=this.$locale().weekStart||0,v=(y<D?y+7:y)-D;return $(r?m-v:m+(6-v),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].substr(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,D=O.m(this,M);return D=(l={},l[c]=D/12,l[f]=D,l[h]=D/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?D:O.a(D)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return v[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),b=_.prototype;return w.prototype=b,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){b[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=v[D],w.Ls=v,w.p={},w}));
    });

    const durationUnitRegex = /[a-zA-Z]/;
    const range = (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);
    // export const characterRange = (startChar, endChar) =>
    //   String.fromCharCode(
    //     ...range(
    //       endChar.charCodeAt(0) - startChar.charCodeAt(0),
    //       startChar.charCodeAt(0)
    //     )
    //   );
    // export const zip = (arr, ...arrs) =>
    //   arr.map((val, i) => arrs.reduce((list, curr) => [...list, curr[i]], [val]));

    /* node_modules/svelte-loading-spinners/dist/Jumper.svelte generated by Svelte v3.46.4 */
    const file$2 = "node_modules/svelte-loading-spinners/dist/Jumper.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (44:2) {#each range(3, 1) as version}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "circle svelte-1cy66mt");
    			set_style(div, "animation-delay", /*durationNum*/ ctx[5] / 3 * (/*version*/ ctx[6] - 1) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$2, 44, 4, 991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(44:2) {#each range(3, 1) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let each_value = range(3, 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-1cy66mt");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$2, 40, 0, 852);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*durationNum, range, durationUnit*/ 48) {
    				each_value = range(3, 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Jumper', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Jumper> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Jumper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Jumper",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get color() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Jumper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Jumper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-loading-spinners/dist/Pulse.svelte generated by Svelte v3.46.4 */
    const file$1 = "node_modules/svelte-loading-spinners/dist/Pulse.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (45:2) {#each range(3, 0) as version}
    function create_each_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "cube svelte-446r86");
    			set_style(div, "animation-delay", /*version*/ ctx[6] * (+/*durationNum*/ ctx[5] / 10) + /*durationUnit*/ ctx[4]);
    			set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 3 + +/*size*/ ctx[3] / 15) + /*unit*/ ctx[1]);
    			add_location(div, file$1, 45, 4, 1049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 3 + +/*size*/ ctx[3] / 15) + /*unit*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(45:2) {#each range(3, 0) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let each_value = range(3, 0);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-446r86");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$1, 41, 0, 911);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*range, durationNum, durationUnit, size, unit*/ 58) {
    				each_value = range(3, 0);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pulse', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.5s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(durationUnitRegex)[0];
    	let durationNum = duration.replace(durationUnitRegex, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pulse> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		durationUnitRegex,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Pulse extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pulse",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get color() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Pulse>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Pulse>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }

    var _ = {
      $(selector) {
        if (typeof selector === "string") {
          return document.querySelector(selector);
        }
        return selector;
      },
      extend(...args) {
        return Object.assign(...args);
      },
      cumulativeOffset(element) {
        let top = 0;
        let left = 0;

        do {
          top += element.offsetTop || 0;
          left += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);

        return {
          top: top,
          left: left
        };
      },
      directScroll(element) {
        return element && element !== document && element !== document.body;
      },
      scrollTop(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollTop = value) : element.scrollTop;
        } else {
          return inSetter
            ? (document.documentElement.scrollTop = document.body.scrollTop = value)
            : window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;
        }
      },
      scrollLeft(element, value) {
        let inSetter = value !== undefined;
        if (this.directScroll(element)) {
          return inSetter ? (element.scrollLeft = value) : element.scrollLeft;
        } else {
          return inSetter
            ? (document.documentElement.scrollLeft = document.body.scrollLeft = value)
            : window.pageXOffset ||
                document.documentElement.scrollLeft ||
                document.body.scrollLeft ||
                0;
        }
      }
    };

    const defaultOptions = {
      container: "body",
      duration: 500,
      delay: 0,
      offset: 0,
      easing: cubicInOut,
      onStart: noop$1,
      onDone: noop$1,
      onAborting: noop$1,
      scrollX: false,
      scrollY: true
    };

    const _scrollTo = options => {
      let {
        offset,
        duration,
        delay,
        easing,
        x=0,
        y=0,
        scrollX,
        scrollY,
        onStart,
        onDone,
        container,
        onAborting,
        element
      } = options;

      if (typeof offset === "function") {
        offset = offset();
      }

      var cumulativeOffsetContainer = _.cumulativeOffset(container);
      var cumulativeOffsetTarget = element
        ? _.cumulativeOffset(element)
        : { top: y, left: x };

      var initialX = _.scrollLeft(container);
      var initialY = _.scrollTop(container);

      var targetX =
        cumulativeOffsetTarget.left - cumulativeOffsetContainer.left + offset;
      var targetY =
        cumulativeOffsetTarget.top - cumulativeOffsetContainer.top + offset;

      var diffX = targetX - initialX;
    	var diffY = targetY - initialY;

      let scrolling = true;
      let started = false;
      let start_time = now() + delay;
      let end_time = start_time + duration;

      function scrollToTopLeft(element, top, left) {
        if (scrollX) _.scrollLeft(element, left);
        if (scrollY) _.scrollTop(element, top);
      }

      function start(delayStart) {
        if (!delayStart) {
          started = true;
          onStart(element, {x, y});
        }
      }

      function tick(progress) {
        scrollToTopLeft(
          container,
          initialY + diffY * progress,
          initialX + diffX * progress
        );
      }

      function stop() {
        scrolling = false;
      }

      loop(now => {
        if (!started && now >= start_time) {
          start(false);
        }

        if (started && now >= end_time) {
          tick(1);
          stop();
          onDone(element, {x, y});
        }

        if (!scrolling) {
          onAborting(element, {x, y});
          return false;
        }
        if (started) {
          const p = now - start_time;
          const t = 0 + 1 * easing(p / duration);
          tick(t);
        }

        return true;
      });

      start(delay);

      tick(0);

      return stop;
    };

    const proceedOptions = options => {
    	let opts = _.extend({}, defaultOptions, options);
      opts.container = _.$(opts.container);
      opts.element = _.$(opts.element);
      return opts;
    };

    const scrollContainerHeight = containerElement => {
      if (
        containerElement &&
        containerElement !== document &&
        containerElement !== document.body
      ) {
        return containerElement.scrollHeight - containerElement.offsetHeight;
      } else {
        let body = document.body;
        let html = document.documentElement;

        return Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
      }
    };

    const setGlobalOptions = options => {
    	_.extend(defaultOptions, options || {});
    };

    const scrollTo = options => {
      return _scrollTo(proceedOptions(options));
    };

    const scrollToBottom = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: scrollContainerHeight(options.container)
        })
      );
    };

    const scrollToTop = options => {
      options = proceedOptions(options);

      return _scrollTo(
        _.extend(options, {
          element: null,
          y: 0
        })
      );
    };

    const makeScrollToAction = scrollToFunc => {
      return (node, options) => {
        let current = options;
        const handle = e => {
          e.preventDefault();
          scrollToFunc(
            typeof current === "string" ? { element: current } : current
          );
        };
        node.addEventListener("click", handle);
        node.addEventListener("touchstart", handle);
        return {
          update(options) {
            current = options;
          },
          destroy() {
            node.removeEventListener("click", handle);
            node.removeEventListener("touchstart", handle);
          }
        };
      };
    };

    const scrollto = makeScrollToAction(scrollTo);
    const scrolltotop = makeScrollToAction(scrollToTop);
    const scrolltobottom = makeScrollToAction(scrollToBottom);

    var animateScroll = /*#__PURE__*/Object.freeze({
        __proto__: null,
        setGlobalOptions: setGlobalOptions,
        scrollTo: scrollTo,
        scrollToBottom: scrollToBottom,
        scrollToTop: scrollToTop,
        makeScrollToAction: makeScrollToAction,
        scrollto: scrollto,
        scrolltotop: scrolltotop,
        scrolltobottom: scrolltobottom
    });

    /* src/App.svelte generated by Svelte v3.46.4 */

    const { console: console_1, window: window_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[40] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    // (592:0) {#if indexContent}
    function create_if_block_15(ctx) {
    	let indexpage;
    	let current;
    	indexpage = new IndexPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(indexpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(indexpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(indexpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(indexpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(indexpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(592:0) {#if indexContent}",
    		ctx
    	});

    	return block;
    }

    // (596:0) {#if coachingContent}
    function create_if_block_14(ctx) {
    	let coachingpage;
    	let current;
    	coachingpage = new CoachingPage({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(coachingpage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(coachingpage, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(coachingpage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(coachingpage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(coachingpage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(596:0) {#if coachingContent}",
    		ctx
    	});

    	return block;
    }

    // (600:0) {#if companionContent}
    function create_if_block_1(ctx) {
    	let div7;
    	let div1;
    	let div0;
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let show_if_3 = /*activeSection*/ ctx[3].startsWith("product");
    	let t3;
    	let navitem3;
    	let t4;
    	let show_if_2 = /*activeSection*/ ctx[3].startsWith("people");
    	let t5;
    	let navitem4;
    	let t6;
    	let show_if_1 = /*activeSection*/ ctx[3].startsWith("process");
    	let t7;
    	let navitem5;
    	let t8;
    	let show_if = /*activeSection*/ ctx[3].startsWith("potpourri");
    	let t9;
    	let current_block_type_index;
    	let if_block4;
    	let t10;
    	let main;
    	let div3;
    	let img;
    	let img_src_value;
    	let t11;
    	let div2;
    	let p0;
    	let t12_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].pretitle + "";
    	let t12;
    	let t13;
    	let p1;
    	let t14_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].title + "";
    	let t14;
    	let t15;
    	let span;
    	let t16_value = playlistCountDisplay(/*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.count) + "";
    	let t16;
    	let t17;
    	let t18_value = playlistDurationDisplay(/*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.duration) + "";
    	let t18;
    	let t19;
    	let div5;
    	let div4;
    	let t20;
    	let t21;
    	let div6;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				name: "home",
    				iconName: "home",
    				title: "Home",
    				active: /*activeSection*/ ctx[3] === "home",
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				name: "framework",
    				iconName: "framework",
    				title: "Framework",
    				active: /*activeSection*/ ctx[3] === "framework",
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				name: "product:deliver",
    				iconName: "product",
    				title: "Product",
    				active: /*activeSection*/ ctx[3].startsWith("product"),
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	let if_block0 = show_if_3 && create_if_block_13(ctx);

    	navitem3 = new NavItem({
    			props: {
    				name: "people:attract",
    				iconName: "people",
    				title: "People",
    				active: /*activeSection*/ ctx[3].startsWith("people"),
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	let if_block1 = show_if_2 && create_if_block_12(ctx);

    	navitem4 = new NavItem({
    			props: {
    				name: "process:time",
    				iconName: "process",
    				title: "Process",
    				active: /*activeSection*/ ctx[3].startsWith("process"),
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	let if_block2 = show_if_1 && create_if_block_11(ctx);

    	navitem5 = new NavItem({
    			props: {
    				name: "potpourri:guidance",
    				iconName: "potpourri",
    				title: "Potpourri",
    				active: /*activeSection*/ ctx[3].startsWith("potpourri"),
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	let if_block3 = show_if && create_if_block_10(ctx);
    	const if_block_creators = [create_if_block_6, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*license*/ ctx[7].active) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block4 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block5 = /*activeVideo*/ ctx[5].premium && !/*license*/ ctx[7].active && create_if_block_5(ctx);
    	let each_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.items;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[40];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			create_component(navitem3.$$.fragment);
    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			create_component(navitem4.$$.fragment);
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			create_component(navitem5.$$.fragment);
    			t8 = space();
    			if (if_block3) if_block3.c();
    			t9 = space();
    			if_block4.c();
    			t10 = space();
    			main = element("main");
    			div3 = element("div");
    			img = element("img");
    			t11 = space();
    			div2 = element("div");
    			p0 = element("p");
    			t12 = text(t12_value);
    			t13 = space();
    			p1 = element("p");
    			t14 = text(t14_value);
    			t15 = space();
    			span = element("span");
    			t16 = text(t16_value);
    			t17 = text(" ·\n              ");
    			t18 = text(t18_value);
    			t19 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t20 = space();
    			if (if_block5) if_block5.c();
    			t21 = space();
    			div6 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "p-4 pl-0 w-full h-full");
    			add_location(div0, file, 605, 6, 17278);
    			attr_dev(div1, "class", "w-fixed-md w-full flex-shrink flex-grow-0 px-0 bg-offwhite");
    			add_location(div1, file, 604, 4, 17199);
    			attr_dev(img, "class", "w-14 h-14 rounded");
    			if (!src_url_equal(img.src, img_src_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].titleImage)) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 847, 8, 25532);
    			attr_dev(p0, "class", "text-sm text-charcoal py-0 my-0 small-caps");
    			add_location(p0, file, 853, 10, 25687);
    			attr_dev(span, "class", "text-lightGray text-sm");
    			add_location(span, file, 858, 12, 25912);
    			attr_dev(p1, "class", "py-0 my-0 text-2xl text-black");
    			add_location(p1, file, 856, 10, 25814);
    			attr_dev(div2, "class", "flex flex-col pl-4");
    			add_location(div2, file, 852, 8, 25644);
    			attr_dev(div3, "class", "flex flex-row justify-items-start items-center px-0 py-2 text-black text-xl");
    			add_location(div3, file, 842, 6, 25394);
    			attr_dev(div4, "id", "player");
    			add_location(div4, file, 888, 8, 27147);
    			attr_dev(div5, "class", "border border-charcoal rounded-lg overflow-hidden shadow-2xl shadow-black flex-auto mb-4 aspect-w-16 aspect-h-9");
    			add_location(div5, file, 885, 6, 26998);
    			attr_dev(div6, "id", "playlist-container");
    			attr_dev(div6, "class", "overflow-hidden overflow-y-scroll max-h-96 flex flex-col");
    			add_location(div6, file, 913, 6, 27989);
    			attr_dev(main, "role", "main");
    			attr_dev(main, "class", "w-full flex-grow pt-4 px-4 bg-white");
    			add_location(main, file, 841, 4, 25324);
    			attr_dev(div7, "class", "w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow");
    			add_location(div7, file, 600, 2, 17081);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div1);
    			append_dev(div1, div0);
    			mount_component(navitem0, div0, null);
    			append_dev(div0, t0);
    			mount_component(navitem1, div0, null);
    			append_dev(div0, t1);
    			mount_component(navitem2, div0, null);
    			append_dev(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t3);
    			mount_component(navitem3, div0, null);
    			append_dev(div0, t4);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t5);
    			mount_component(navitem4, div0, null);
    			append_dev(div0, t6);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t7);
    			mount_component(navitem5, div0, null);
    			append_dev(div0, t8);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t9);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div7, t10);
    			append_dev(div7, main);
    			append_dev(main, div3);
    			append_dev(div3, img);
    			append_dev(div3, t11);
    			append_dev(div3, div2);
    			append_dev(div2, p0);
    			append_dev(p0, t12);
    			append_dev(div2, t13);
    			append_dev(div2, p1);
    			append_dev(p1, t14);
    			append_dev(p1, t15);
    			append_dev(p1, span);
    			append_dev(span, t16);
    			append_dev(span, t17);
    			append_dev(span, t18);
    			append_dev(main, t19);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t20);
    			if (if_block5) if_block5.m(div5, null);
    			append_dev(main, t21);
    			append_dev(main, div6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem0_changes.active = /*activeSection*/ ctx[3] === "home";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem1_changes.active = /*activeSection*/ ctx[3] === "framework";
    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem2_changes.active = /*activeSection*/ ctx[3].startsWith("product");
    			navitem2.$set(navitem2_changes);
    			if (dirty[0] & /*activeSection*/ 8) show_if_3 = /*activeSection*/ ctx[3].startsWith("product");

    			if (show_if_3) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*activeSection*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_13(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const navitem3_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem3_changes.active = /*activeSection*/ ctx[3].startsWith("people");
    			navitem3.$set(navitem3_changes);
    			if (dirty[0] & /*activeSection*/ 8) show_if_2 = /*activeSection*/ ctx[3].startsWith("people");

    			if (show_if_2) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*activeSection*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_12(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t5);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			const navitem4_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem4_changes.active = /*activeSection*/ ctx[3].startsWith("process");
    			navitem4.$set(navitem4_changes);
    			if (dirty[0] & /*activeSection*/ 8) show_if_1 = /*activeSection*/ ctx[3].startsWith("process");

    			if (show_if_1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*activeSection*/ 8) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_11(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t7);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const navitem5_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem5_changes.active = /*activeSection*/ ctx[3].startsWith("potpourri");
    			navitem5.$set(navitem5_changes);
    			if (dirty[0] & /*activeSection*/ 8) show_if = /*activeSection*/ ctx[3].startsWith("potpourri");

    			if (show_if) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*activeSection*/ 8) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_10(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, t9);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block4 = if_blocks[current_block_type_index];

    				if (!if_block4) {
    					if_block4 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block4.c();
    				} else {
    					if_block4.p(ctx, dirty);
    				}

    				transition_in(if_block4, 1);
    				if_block4.m(div0, null);
    			}

    			if (!current || dirty[0] & /*sections, activeSection*/ 24 && !src_url_equal(img.src, img_src_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].titleImage)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t12_value !== (t12_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].pretitle + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t14_value !== (t14_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].title + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t16_value !== (t16_value = playlistCountDisplay(/*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.count) + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t18_value !== (t18_value = playlistDurationDisplay(/*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.duration) + "")) set_data_dev(t18, t18_value);

    			if (/*activeVideo*/ ctx[5].premium && !/*license*/ ctx[7].active) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty[0] & /*activeVideo, license*/ 160) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_5(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div5, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*activeVideo, license, sections, activeSection, handleSelectVideo*/ 131256) {
    				each_value = /*sections*/ ctx[4][/*activeSection*/ ctx[3]].playlist.items;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div6, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(navitem3.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(navitem4.$$.fragment, local);
    			transition_in(if_block2);
    			transition_in(navitem5.$$.fragment, local);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(navitem3.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(navitem4.$$.fragment, local);
    			transition_out(if_block2);
    			transition_out(navitem5.$$.fragment, local);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_component(navitem0);
    			destroy_component(navitem1);
    			destroy_component(navitem2);
    			if (if_block0) if_block0.d();
    			destroy_component(navitem3);
    			if (if_block1) if_block1.d();
    			destroy_component(navitem4);
    			if (if_block2) if_block2.d();
    			destroy_component(navitem5);
    			if (if_block3) if_block3.d();
    			if_blocks[current_block_type_index].d();
    			if (if_block5) if_block5.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(600:0) {#if companionContent}",
    		ctx
    	});

    	return block;
    }

    // (630:8) {#if activeSection.startsWith("product")}
    function create_if_block_13(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let navitem3;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				name: "product:deliver",
    				title: "Deliver",
    				active: /*activeSection*/ ctx[3] === "product:deliver",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				name: "product:balance",
    				title: "Balance",
    				active: /*activeSection*/ ctx[3] === "product:balance",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				name: "product:engineers",
    				title: "Inspire engineers",
    				active: /*activeSection*/ ctx[3] === "product:engineers",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem3 = new NavItem({
    			props: {
    				name: "product:users",
    				title: "Inspire users",
    				active: /*activeSection*/ ctx[3] === "product:users",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			create_component(navitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navitem3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem0_changes.active = /*activeSection*/ ctx[3] === "product:deliver";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem1_changes.active = /*activeSection*/ ctx[3] === "product:balance";
    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem2_changes.active = /*activeSection*/ ctx[3] === "product:engineers";
    			navitem2.$set(navitem2_changes);
    			const navitem3_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem3_changes.active = /*activeSection*/ ctx[3] === "product:users";
    			navitem3.$set(navitem3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(navitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(navitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(630:8) {#if activeSection.startsWith(\\\"product\\\")}",
    		ctx
    	});

    	return block;
    }

    // (667:8) {#if activeSection.startsWith("people")}
    function create_if_block_12(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				name: "people:attract",
    				title: "Attract",
    				active: /*activeSection*/ ctx[3] === "people:attract",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				name: "people:structure",
    				title: "Structure",
    				active: /*activeSection*/ ctx[3] === "people:structure",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				name: "people:motivate",
    				title: "Motivate",
    				active: /*activeSection*/ ctx[3] === "people:motivate",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem0_changes.active = /*activeSection*/ ctx[3] === "people:attract";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem1_changes.active = /*activeSection*/ ctx[3] === "people:structure";
    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem2_changes.active = /*activeSection*/ ctx[3] === "people:motivate";
    			navitem2.$set(navitem2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(667:8) {#if activeSection.startsWith(\\\"people\\\")}",
    		ctx
    	});

    	return block;
    }

    // (697:8) {#if activeSection.startsWith("process")}
    function create_if_block_11(ctx) {
    	let navitem0;
    	let t0;
    	let navitem1;
    	let t1;
    	let navitem2;
    	let t2;
    	let navitem3;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				name: "process:time",
    				title: "Time",
    				active: /*activeSection*/ ctx[3] === "process:time",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				name: "process:budget",
    				title: "Budget",
    				active: /*activeSection*/ ctx[3] === "process:budget",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem2 = new NavItem({
    			props: {
    				name: "process:quality",
    				title: "Quality",
    				active: /*activeSection*/ ctx[3] === "process:quality",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem3 = new NavItem({
    			props: {
    				name: "process:stakeholders",
    				title: "Stakeholders",
    				active: /*activeSection*/ ctx[3] === "process:stakeholders",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t0 = space();
    			create_component(navitem1.$$.fragment);
    			t1 = space();
    			create_component(navitem2.$$.fragment);
    			t2 = space();
    			create_component(navitem3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(navitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(navitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(navitem3, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem0_changes.active = /*activeSection*/ ctx[3] === "process:time";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem1_changes.active = /*activeSection*/ ctx[3] === "process:budget";
    			navitem1.$set(navitem1_changes);
    			const navitem2_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem2_changes.active = /*activeSection*/ ctx[3] === "process:quality";
    			navitem2.$set(navitem2_changes);
    			const navitem3_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem3_changes.active = /*activeSection*/ ctx[3] === "process:stakeholders";
    			navitem3.$set(navitem3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			transition_in(navitem2.$$.fragment, local);
    			transition_in(navitem3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			transition_out(navitem2.$$.fragment, local);
    			transition_out(navitem3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(navitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(navitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(navitem3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(697:8) {#if activeSection.startsWith(\\\"process\\\")}",
    		ctx
    	});

    	return block;
    }

    // (734:8) {#if activeSection.startsWith("potpourri")}
    function create_if_block_10(ctx) {
    	let navitem0;
    	let t;
    	let navitem1;
    	let current;

    	navitem0 = new NavItem({
    			props: {
    				name: "potpourri:guidance",
    				title: "Guidance",
    				active: /*activeSection*/ ctx[3] === "potpourri:guidance",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	navitem1 = new NavItem({
    			props: {
    				name: "potpourri:scenarios",
    				title: "Scenarios",
    				active: /*activeSection*/ ctx[3] === "potpourri:scenarios",
    				secondary: true,
    				onActivate: /*handleSelectSection*/ ctx[16]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navitem0.$$.fragment);
    			t = space();
    			create_component(navitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(navitem1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navitem0_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem0_changes.active = /*activeSection*/ ctx[3] === "potpourri:guidance";
    			navitem0.$set(navitem0_changes);
    			const navitem1_changes = {};
    			if (dirty[0] & /*activeSection*/ 8) navitem1_changes.active = /*activeSection*/ ctx[3] === "potpourri:scenarios";
    			navitem1.$set(navitem1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navitem0.$$.fragment, local);
    			transition_in(navitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navitem0.$$.fragment, local);
    			transition_out(navitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(navitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(734:8) {#if activeSection.startsWith(\\\"potpourri\\\")}",
    		ctx
    	});

    	return block;
    }

    // (773:8) {:else}
    function create_else_block_1(ctx) {
    	let div1;
    	let div0;
    	let icon;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				name: "license",
    				classNames: "",
    				stroke: "#575757",
    				strokeWidth: 2
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_7, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (!/*licenseKeyAreaActive*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "License";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "BASIC";
    			t4 = space();
    			if_block.c();
    			attr_dev(p0, "class", "p-0 pl-4 text-lg");
    			add_location(p0, file, 785, 14, 23177);
    			attr_dev(div0, "class", "flex flex-row justify-items-start items-center p-0 text-charcoal");
    			add_location(div0, file, 776, 12, 22890);
    			attr_dev(p1, "class", "p-0 pl-10 text-lg text-red100 cursor-pointer");
    			add_location(p1, file, 787, 12, 23248);
    			attr_dev(div1, "class", "flex flex-col mt-12 ml-4 p-4 border border-red100 rounded bg-white");
    			add_location(div1, file, 773, 10, 22774);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(icon, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p0);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(div1, t4);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*click_handler_1*/ ctx[22], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(773:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (751:8) {#if license.active}
    function create_if_block_6(ctx) {
    	let div1;
    	let div0;
    	let icon;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let p2;
    	let span;
    	let br;
    	let t6;
    	let t7_value = dayjs_min(/*license*/ ctx[7].expiresAt).format("MMMM D, YYYY h:mm A") + "";
    	let t7;
    	let t8;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				name: "license",
    				classNames: "",
    				stroke: "#575757",
    				strokeWidth: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "License";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "PREMIUM";
    			t4 = space();
    			p2 = element("p");
    			span = element("span");
    			span.textContent = "Active Until";
    			br = element("br");
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			button = element("button");
    			button.textContent = "(clear license)";
    			attr_dev(p0, "class", "p-0 pl-4 text-lg");
    			add_location(p0, file, 761, 14, 22268);
    			attr_dev(div0, "class", "flex flex-row justify-items-start items-center p-0 text-charcoal");
    			add_location(div0, file, 752, 12, 21981);
    			attr_dev(p1, "class", "p-0 pl-10 text-lg");
    			add_location(p1, file, 763, 12, 22339);
    			attr_dev(span, "class", "text-black font-bold");
    			add_location(span, file, 765, 14, 22451);
    			add_location(br, file, 765, 68, 22505);
    			attr_dev(p2, "class", "text-sm text-charcoal pl-10 pt-6");
    			add_location(p2, file, 764, 12, 22392);
    			attr_dev(button, "class", "pl-10 text-red100");
    			add_location(button, file, 768, 12, 22612);
    			attr_dev(div1, "class", "mt-12 ml-4 p-4 border border-charcoal rounded bg-white");
    			add_location(div1, file, 751, 10, 21900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(icon, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, p0);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(div1, t4);
    			append_dev(div1, p2);
    			append_dev(p2, span);
    			append_dev(p2, br);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			append_dev(div1, t8);
    			append_dev(div1, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*license*/ 128) && t7_value !== (t7_value = dayjs_min(/*license*/ ctx[7].expiresAt).format("MMMM D, YYYY h:mm A") + "")) set_data_dev(t7, t7_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(751:8) {#if license.active}",
    		ctx
    	});

    	return block;
    }

    // (802:12) {:else}
    function create_else_block_2(ctx) {
    	let div;
    	let t0;
    	let p0;
    	let t2;
    	let form;
    	let input;
    	let t3;
    	let t4;
    	let p1;
    	let t6;
    	let buybutton;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*licenseKeyAreaOverlayActive*/ ctx[8] && create_if_block_9(ctx);
    	let if_block1 = /*licenseKeyErrorText*/ ctx[2] && create_if_block_8(ctx);

    	buybutton = new BuyButton({
    			props: {
    				buttonText: "BUY NOW",
    				elementId: "buy-button-1"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Have a license key?";
    			t2 = space();
    			form = element("form");
    			input = element("input");
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Need a license key?";
    			t6 = space();
    			create_component(buybutton.$$.fragment);
    			add_location(p0, file, 818, 16, 24447);
    			attr_dev(input, "class", "shadow appearance-none border border-lightGray rounded w-full py-2 px-3 text-gray-700 text-center focus:outline-none focus:shadow-outline");
    			attr_dev(input, "id", "licensekey");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Enter it here.");
    			add_location(input, file, 820, 18, 24515);
    			add_location(form, file, 819, 16, 24490);
    			attr_dev(p1, "class", "m-0 pt-8");
    			add_location(p1, file, 833, 16, 25106);
    			attr_dev(div, "class", "relative flex flex-col p-4 text-center");
    			add_location(div, file, 802, 14, 23768);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, p0);
    			append_dev(div, t2);
    			append_dev(div, form);
    			append_dev(form, input);
    			append_dev(div, t3);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(div, t6);
    			mount_component(buybutton, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*checkLicenseKey*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*licenseKeyAreaOverlayActive*/ ctx[8]) {
    				if (if_block0) {
    					if (dirty[0] & /*licenseKeyAreaOverlayActive*/ 256) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*licenseKeyErrorText*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					if_block1.m(div, t4);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(buybutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(buybutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(buybutton);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(802:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (795:12) {#if !licenseKeyAreaActive}
    function create_if_block_7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Access Premium Content";
    			attr_dev(button, "class", "mt-4 justify-self-center px-3 py-2 bg-red100 text-white text-sm rounded-lg hover:shadow-lg");
    			add_location(button, file, 795, 14, 23478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(795:12) {#if !licenseKeyAreaActive}",
    		ctx
    	});

    	return block;
    }

    // (804:16) {#if licenseKeyAreaOverlayActive}
    function create_if_block_9(ctx) {
    	let div1;
    	let p;
    	let t1;
    	let div0;
    	let jumper;
    	let current;

    	jumper = new Jumper({
    			props: {
    				size: "96",
    				color: "#D20000",
    				unit: "px",
    				duration: "1s"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Validating key...";
    			t1 = space();
    			div0 = element("div");
    			create_component(jumper.$$.fragment);
    			attr_dev(p, "class", "text-white pt-4");
    			add_location(p, file, 807, 20, 24029);
    			attr_dev(div0, "class", "text-center pt-4 flex flex-col items-center");
    			add_location(div0, file, 808, 20, 24098);
    			attr_dev(div1, "class", "absolute top-0 left-0 w-full h-full bg-black rounded-lg opacity-90");
    			add_location(div1, file, 804, 18, 23889);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, p);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(jumper, div0, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jumper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jumper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(jumper);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(804:16) {#if licenseKeyAreaOverlayActive}",
    		ctx
    	});

    	return block;
    }

    // (829:16) {#if licenseKeyErrorText}
    function create_if_block_8(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*licenseKeyErrorText*/ ctx[2]);
    			attr_dev(p, "class", "m-0 pt-2 text-red100 w-48 mx-auto");
    			add_location(p, file, 829, 18, 24957);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*licenseKeyErrorText*/ 4) set_data_dev(t, /*licenseKeyErrorText*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(829:16) {#if licenseKeyErrorText}",
    		ctx
    	});

    	return block;
    }

    // (890:8) {#if activeVideo.premium && !license.active}
    function create_if_block_5(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let icon;
    	let t1;
    	let p;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				name: "lock",
    				classNames: "w-8 h-8 mx-auto cursor-pointer",
    				stroke: "#ffffff",
    				strokeWidth: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			create_component(icon.$$.fragment);
    			t1 = space();
    			p = element("p");
    			p.textContent = "Premium Content";
    			attr_dev(img, "class", "inline-block w-96 mx-auto rounded-lg mb-8");
    			if (!src_url_equal(img.src, img_src_value = /*activeVideo*/ ctx[5].thumbnailLarge)) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 897, 14, 27509);
    			attr_dev(p, "class", "inline-block mx-auto text-lightGray");
    			add_location(p, file, 907, 14, 27852);
    			attr_dev(div0, "class", "w-96 mx-auto flex flex-col justify-items-center cursor-pointer");
    			add_location(div0, file, 893, 12, 27337);
    			attr_dev(div1, "class", "w-full flex flex-col bg-black justify-center align-center");
    			add_location(div1, file, 890, 10, 27230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			mount_component(icon, div0, null);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*click_handler_3*/ ctx[24], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*activeVideo*/ 32 && !src_url_equal(img.src, img_src_value = /*activeVideo*/ ctx[5].thumbnailLarge)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(890:8) {#if activeVideo.premium && !license.active}",
    		ctx
    	});

    	return block;
    }

    // (1029:10) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div1;
    	let p0;
    	let t1_value = /*item*/ ctx[40].title + "";
    	let t1;
    	let t2;
    	let div0;
    	let p1;
    	let t3_value = videoDurationDisplay(/*item*/ ctx[40].duration) + "";
    	let t3;
    	let t4;
    	let p2;
    	let t5_value = dayjs_min(/*item*/ ctx[40].publishedAt).format("MMM D, YYYY") + "";
    	let t5;
    	let t6;
    	let t7;
    	let div2_id_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*item*/ ctx[40].premium && !/*license*/ ctx[7].active && create_if_block_4(ctx);

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[25](/*item*/ ctx[40]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p2 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			attr_dev(img, "class", "h-16 rounded");
    			if (!src_url_equal(img.src, img_src_value = /*item*/ ctx[40].thumbnail)) attr_dev(img, "src", img_src_value);
    			add_location(img, file, 1040, 14, 34490);
    			attr_dev(p0, "class", "text-lg py-0 my-0");
    			add_location(p0, file, 1042, 16, 34599);
    			attr_dev(p1, "class", "text-sm text-lightGray py-0 my-0 mr-4");
    			add_location(p1, file, 1046, 18, 34756);
    			attr_dev(div0, "class", "flex flex-row items-center");
    			add_location(div0, file, 1045, 16, 34697);
    			attr_dev(div1, "class", "mx-8 flex-grow");
    			add_location(div1, file, 1041, 14, 34554);
    			attr_dev(p2, "class", "inline-block text-lightGray text-sm w-fixed-sm");
    			add_location(p2, file, 1051, 14, 34945);
    			attr_dev(div2, "id", div2_id_value = /*item*/ ctx[40].key);
    			attr_dev(div2, "class", "flex flex-row relative justify-items-start p-2 pl-4 items-center border border-transparent rounded rounded-lg text-charcoal hover:text-black hover:bg-offwhite cursor-pointer");
    			add_location(div2, file, 1029, 12, 34072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, p1);
    			append_dev(p1, t3);
    			append_dev(div2, t4);
    			append_dev(div2, p2);
    			append_dev(p2, t5);
    			append_dev(div2, t6);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t7);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler_4, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*sections, activeSection*/ 24 && !src_url_equal(img.src, img_src_value = /*item*/ ctx[40].thumbnail)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t1_value !== (t1_value = /*item*/ ctx[40].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t3_value !== (t3_value = videoDurationDisplay(/*item*/ ctx[40].duration) + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[0] & /*sections, activeSection*/ 24) && t5_value !== (t5_value = dayjs_min(/*item*/ ctx[40].publishedAt).format("MMM D, YYYY") + "")) set_data_dev(t5, t5_value);

    			if (/*item*/ ctx[40].premium && !/*license*/ ctx[7].active) {
    				if (if_block) {
    					if (dirty[0] & /*sections, activeSection, license*/ 152) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, t7);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*sections, activeSection*/ 24 && div2_id_value !== (div2_id_value = /*item*/ ctx[40].key)) {
    				attr_dev(div2, "id", div2_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(1029:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (919:10) {#if item.key === activeVideo.key}
    function create_if_block_2(ctx) {
    	let div6;
    	let p0;
    	let t0_value = /*activeVideo*/ ctx[5].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let p1;
    	let t3_value = /*activeVideo*/ ctx[5].description + "";
    	let t3;
    	let t4;
    	let div5;
    	let div2;
    	let p2;
    	let t6;
    	let div1;
    	let div0;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t9;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t10;
    	let a4;
    	let img4;
    	let img4_src_value;
    	let t11;
    	let div4;
    	let p3;
    	let t13;
    	let div3;
    	let p4;
    	let a5;
    	let t14;
    	let span0;
    	let t16;
    	let p5;
    	let a6;
    	let t18;
    	let p6;
    	let a7;
    	let t20;
    	let p7;
    	let a8;
    	let t22;
    	let p8;
    	let a9;
    	let t23;
    	let span1;
    	let t25;
    	let p9;
    	let a10;
    	let t27;
    	let p10;
    	let a11;
    	let t29;
    	let p11;
    	let a12;
    	let t31;
    	let div6_id_value;
    	let current;
    	let if_block = /*activeVideo*/ ctx[5].premium && !/*license*/ ctx[7].active && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			p1 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			div5 = element("div");
    			div2 = element("div");
    			p2 = element("p");
    			p2.textContent = "Related Books";
    			t6 = space();
    			div1 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t7 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t8 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t9 = space();
    			a3 = element("a");
    			img3 = element("img");
    			t10 = space();
    			a4 = element("a");
    			img4 = element("img");
    			t11 = space();
    			div4 = element("div");
    			p3 = element("p");
    			p3.textContent = "Related Links";
    			t13 = space();
    			div3 = element("div");
    			p4 = element("p");
    			a5 = element("a");
    			t14 = text("· Creating an Environment of Resilience ");
    			span0 = element("span");
    			span0.textContent = "· github.com";
    			t16 = space();
    			p5 = element("p");
    			a6 = element("a");
    			a6.textContent = "· Some Link";
    			t18 = space();
    			p6 = element("p");
    			a7 = element("a");
    			a7.textContent = "· Creating an Environment of Resilience";
    			t20 = space();
    			p7 = element("p");
    			a8 = element("a");
    			a8.textContent = "· Some Link";
    			t22 = space();
    			p8 = element("p");
    			a9 = element("a");
    			t23 = text("· Creating an Environment of Resilience ");
    			span1 = element("span");
    			span1.textContent = "· github.com";
    			t25 = space();
    			p9 = element("p");
    			a10 = element("a");
    			a10.textContent = "· Some Link";
    			t27 = space();
    			p10 = element("p");
    			a11 = element("a");
    			a11.textContent = "· Creating an Environment of Resilience";
    			t29 = space();
    			p11 = element("p");
    			a12 = element("a");
    			a12.textContent = "· Some Link";
    			t31 = space();
    			attr_dev(p0, "class", "text-xl text-black");
    			add_location(p0, file, 926, 14, 28540);
    			attr_dev(p1, "class", "text-charcoal");
    			add_location(p1, file, 932, 14, 28750);
    			attr_dev(p2, "class", "text-black text-lg");
    			add_location(p2, file, 937, 18, 28932);
    			attr_dev(img0, "class", "w-16");
    			attr_dev(img0, "border", "0");
    			if (!src_url_equal(img0.src, img0_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 944, 25, 29419);
    			attr_dev(a0, "class", "mr-2");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a0, file, 940, 22, 29096);
    			attr_dev(img1, "class", "w-16");
    			attr_dev(img1, "border", "0");
    			if (!src_url_equal(img1.src, img1_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 954, 25, 30092);
    			attr_dev(a1, "class", "mr-2");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a1, file, 950, 22, 29769);
    			attr_dev(img2, "class", "w-16");
    			attr_dev(img2, "border", "0");
    			if (!src_url_equal(img2.src, img2_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 964, 25, 30765);
    			attr_dev(a2, "class", "mr-2");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a2, file, 960, 22, 30442);
    			attr_dev(img3, "class", "w-16");
    			attr_dev(img3, "border", "0");
    			if (!src_url_equal(img3.src, img3_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 974, 25, 31438);
    			attr_dev(a3, "class", "mr-2");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a3, file, 970, 22, 31115);
    			attr_dev(img4, "class", "w-16");
    			attr_dev(img4, "border", "0");
    			if (!src_url_equal(img4.src, img4_src_value = "//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=0062663070&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL250_&tag=briandainton-20")) attr_dev(img4, "src", img4_src_value);
    			add_location(img4, file, 984, 25, 32111);
    			attr_dev(a4, "class", "mr-2");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "href", "https://www.amazon.com/gp/product/0062663070/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=0062663070&linkCode=as2&tag=briandainton-20&linkId=bee10213d5fe5a1da7863458e22d4d70");
    			add_location(a4, file, 980, 22, 31788);
    			attr_dev(div0, "class", "flex flex-row");
    			add_location(div0, file, 939, 20, 29046);
    			attr_dev(div1, "class", "flex flex-row");
    			add_location(div1, file, 938, 18, 28998);
    			attr_dev(div2, "class", "mr-4");
    			add_location(div2, file, 936, 16, 28895);
    			attr_dev(p3, "class", "text-black text-lg");
    			add_location(p3, file, 994, 18, 32572);
    			attr_dev(span0, "class", "text-lightGray text-sm");
    			add_location(span0, file, 998, 65, 32807);
    			attr_dev(a5, "href", "#");
    			add_location(a5, file, 997, 22, 32730);
    			attr_dev(p4, "class", "py-0 my-0");
    			add_location(p4, file, 996, 20, 32686);
    			attr_dev(a6, "href", "#");
    			add_location(a6, file, 1005, 41, 33060);
    			attr_dev(p5, "class", "py-0 my-0");
    			add_location(p5, file, 1005, 20, 33039);
    			attr_dev(a7, "href", "#");
    			add_location(a7, file, 1007, 22, 33156);
    			attr_dev(p6, "class", "py-0 my-0");
    			add_location(p6, file, 1006, 20, 33112);
    			attr_dev(a8, "href", "#");
    			add_location(a8, file, 1009, 41, 33278);
    			attr_dev(p7, "class", "py-0 my-0");
    			add_location(p7, file, 1009, 20, 33257);
    			attr_dev(span1, "class", "text-lightGray text-sm");
    			add_location(span1, file, 1012, 65, 33451);
    			attr_dev(a9, "href", "#");
    			add_location(a9, file, 1011, 22, 33374);
    			attr_dev(p8, "class", "py-0 my-0");
    			add_location(p8, file, 1010, 20, 33330);
    			attr_dev(a10, "href", "#");
    			add_location(a10, file, 1019, 41, 33704);
    			attr_dev(p9, "class", "py-0 my-0");
    			add_location(p9, file, 1019, 20, 33683);
    			attr_dev(a11, "href", "#");
    			add_location(a11, file, 1021, 22, 33800);
    			attr_dev(p10, "class", "py-0 my-0");
    			add_location(p10, file, 1020, 20, 33756);
    			attr_dev(a12, "href", "#");
    			add_location(a12, file, 1023, 41, 33922);
    			attr_dev(p11, "class", "py-0 my-0");
    			add_location(p11, file, 1023, 20, 33901);
    			attr_dev(div3, "class", "flex flex-col");
    			add_location(div3, file, 995, 18, 32638);
    			attr_dev(div4, "class", "flex-grow");
    			add_location(div4, file, 993, 16, 32530);
    			attr_dev(div5, "class", "flex flex-row");
    			add_location(div5, file, 935, 14, 28851);
    			attr_dev(div6, "id", div6_id_value = "video-" + /*activeVideo*/ ctx[5].key);
    			attr_dev(div6, "class", "flex flex-col justify-items-start items-start p-2 pl-4 mb-2 text-black border-solid border-0 border-l-4 border-red100 hover:bg-white");
    			add_location(div6, file, 919, 12, 28241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, p0);
    			append_dev(p0, t0);
    			append_dev(div6, t1);
    			if (if_block) if_block.m(div6, null);
    			append_dev(div6, t2);
    			append_dev(div6, p1);
    			append_dev(p1, t3);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, p2);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img0);
    			append_dev(div0, t7);
    			append_dev(div0, a1);
    			append_dev(a1, img1);
    			append_dev(div0, t8);
    			append_dev(div0, a2);
    			append_dev(a2, img2);
    			append_dev(div0, t9);
    			append_dev(div0, a3);
    			append_dev(a3, img3);
    			append_dev(div0, t10);
    			append_dev(div0, a4);
    			append_dev(a4, img4);
    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, p3);
    			append_dev(div4, t13);
    			append_dev(div4, div3);
    			append_dev(div3, p4);
    			append_dev(p4, a5);
    			append_dev(a5, t14);
    			append_dev(a5, span0);
    			append_dev(div3, t16);
    			append_dev(div3, p5);
    			append_dev(p5, a6);
    			append_dev(div3, t18);
    			append_dev(div3, p6);
    			append_dev(p6, a7);
    			append_dev(div3, t20);
    			append_dev(div3, p7);
    			append_dev(p7, a8);
    			append_dev(div3, t22);
    			append_dev(div3, p8);
    			append_dev(p8, a9);
    			append_dev(a9, t23);
    			append_dev(a9, span1);
    			append_dev(div3, t25);
    			append_dev(div3, p9);
    			append_dev(p9, a10);
    			append_dev(div3, t27);
    			append_dev(div3, p10);
    			append_dev(p10, a11);
    			append_dev(div3, t29);
    			append_dev(div3, p11);
    			append_dev(p11, a12);
    			append_dev(div6, t31);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*activeVideo*/ 32) && t0_value !== (t0_value = /*activeVideo*/ ctx[5].title + "")) set_data_dev(t0, t0_value);

    			if (/*activeVideo*/ ctx[5].premium && !/*license*/ ctx[7].active) {
    				if (if_block) {
    					if (dirty[0] & /*activeVideo, license*/ 160) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div6, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty[0] & /*activeVideo*/ 32) && t3_value !== (t3_value = /*activeVideo*/ ctx[5].description + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty[0] & /*activeVideo*/ 32 && div6_id_value !== (div6_id_value = "video-" + /*activeVideo*/ ctx[5].key)) {
    				attr_dev(div6, "id", div6_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(919:10) {#if item.key === activeVideo.key}",
    		ctx
    	});

    	return block;
    }

    // (1055:14) {#if item.premium && !license.active}
    function create_if_block_4(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				name: "lock",
    				width: "16",
    				height: "16",
    				classNames: "",
    				stroke: "#ffffff",
    				strokeWidth: 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "h-[12px] w-[12px] rounded-full bg-red100 p-1 absolute top-4 left-0 border border-white");
    			add_location(div, file, 1055, 16, 35155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(1055:14) {#if item.premium && !license.active}",
    		ctx
    	});

    	return block;
    }

    // (930:14) {#if activeVideo.premium && !license.active}
    function create_if_block_3(ctx) {
    	let premiumtag;
    	let current;
    	premiumtag = new PremiumTag({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(premiumtag.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(premiumtag, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(premiumtag.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(premiumtag.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(premiumtag, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(930:14) {#if activeVideo.premium && !license.active}",
    		ctx
    	});

    	return block;
    }

    // (918:8) {#each sections[activeSection].playlist.items as item, index (item)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*item*/ ctx[40].key === /*activeVideo*/ ctx[5].key) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(918:8) {#each sections[activeSection].playlist.items as item, index (item)}",
    		ctx
    	});

    	return block;
    }

    // (1217:8) {#if devMode}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Clear";
    			attr_dev(button, "class", "px-4 py-2 bg-gold text-black font-medium rounded-md w-44 shadow-sm uppercase");
    			add_location(button, file, 1217, 10, 41669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[27], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(1217:8) {#if devMode}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let div4;
    	let div3;
    	let div2;
    	let h3;
    	let t4;
    	let div0;
    	let p0;
    	let t5;
    	let span0;
    	let t7;
    	let t8;
    	let p1;
    	let span1;
    	let br0;
    	let t10;
    	let t11_value = /*license*/ ctx[7].key + "";
    	let t11;
    	let t12;
    	let p2;
    	let span2;
    	let br1;
    	let t14;
    	let t15_value = dayjs_min(/*license*/ ctx[7].firstUsedAt).format("dddd, MMMM D, YYYY h:mm A") + "";
    	let t15;
    	let t16;
    	let p3;
    	let span3;
    	let br2;
    	let t18;
    	let t19_value = dayjs_min(/*license*/ ctx[7].expiresAt).format("dddd, MMMM D, YYYY h:mm A") + "";
    	let t19;
    	let t20;
    	let div1;
    	let button;
    	let t22;
    	let div4_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*indexContent*/ ctx[9] && create_if_block_15(ctx);
    	let if_block1 = /*coachingContent*/ ctx[10] && create_if_block_14(ctx);
    	let if_block2 = /*companionContent*/ ctx[11] && create_if_block_1(ctx);
    	let if_block3 = /*devMode*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h3 = element("h3");
    			h3.textContent = "About";
    			t4 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t5 = text("This is ");
    			span0 = element("span");
    			span0.textContent = "The Engineering Manager's Companion";
    			t7 = text(", a video compendium for software development leaders.");
    			t8 = space();
    			p1 = element("p");
    			span1 = element("span");
    			span1.textContent = "License Key";
    			br0 = element("br");
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = space();
    			p2 = element("p");
    			span2 = element("span");
    			span2.textContent = "First Used On";
    			br1 = element("br");
    			t14 = space();
    			t15 = text(t15_value);
    			t16 = space();
    			p3 = element("p");
    			span3 = element("span");
    			span3.textContent = "Expires On";
    			br2 = element("br");
    			t18 = space();
    			t19 = text(t19_value);
    			t20 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "OK";
    			t22 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(h3, "class", "text-lg font-medium text-black uppercase");
    			add_location(h3, file, 1189, 6, 40475);
    			attr_dev(span0, "class", "text-black font-bold");
    			add_location(span0, file, 1192, 18, 40644);
    			attr_dev(p0, "class", "text-sm text-charcoal");
    			add_location(p0, file, 1191, 8, 40592);
    			attr_dev(span1, "class", "text-black font-bold");
    			add_location(span1, file, 1197, 10, 40870);
    			add_location(br0, file, 1197, 63, 40923);
    			attr_dev(p1, "class", "text-sm text-charcoal pt-6");
    			add_location(p1, file, 1196, 8, 40821);
    			attr_dev(span2, "class", "text-black font-bold");
    			add_location(span2, file, 1201, 10, 41024);
    			add_location(br1, file, 1201, 65, 41079);
    			attr_dev(p2, "class", "text-sm text-charcoal pt-6");
    			add_location(p2, file, 1200, 8, 40975);
    			attr_dev(span3, "class", "text-black font-bold");
    			add_location(span3, file, 1205, 10, 41231);
    			add_location(br2, file, 1205, 62, 41283);
    			attr_dev(p3, "class", "text-sm text-charcoal pt-6");
    			add_location(p3, file, 1204, 8, 41182);
    			attr_dev(div0, "class", "mt-2 pt-4 px-4 text-left");
    			add_location(div0, file, 1190, 6, 40545);
    			attr_dev(button, "class", "px-4 py-2 bg-red100 text-white font-medium rounded-md w-14 shadow-sm uppercase");
    			add_location(button, file, 1210, 8, 41445);
    			attr_dev(div1, "class", "items-center px-4 py-6 pt-8");
    			add_location(div1, file, 1209, 6, 41395);
    			attr_dev(div2, "class", "mt-3 text-center");
    			add_location(div2, file, 1188, 4, 40438);
    			attr_dev(div3, "class", "relative top-24 mx-auto py-5 border border-black w-96 shadow-lg rounded-md bg-white");
    			add_location(div3, file, 1184, 2, 40285);
    			attr_dev(div4, "class", div4_class_value = "fixed " + (!/*aboutModalActive*/ ctx[6] ? 'hidden' : '') + " z-50 inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full");
    			attr_dev(div4, "id", "about-modal");
    			add_location(div4, file, 1177, 0, 40093);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h3);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t5);
    			append_dev(p0, span0);
    			append_dev(p0, t7);
    			append_dev(div0, t8);
    			append_dev(div0, p1);
    			append_dev(p1, span1);
    			append_dev(p1, br0);
    			append_dev(p1, t10);
    			append_dev(p1, t11);
    			append_dev(div0, t12);
    			append_dev(div0, p2);
    			append_dev(p2, span2);
    			append_dev(p2, br1);
    			append_dev(p2, t14);
    			append_dev(p2, t15);
    			append_dev(div0, t16);
    			append_dev(div0, p3);
    			append_dev(p3, span3);
    			append_dev(p3, br2);
    			append_dev(p3, t18);
    			append_dev(p3, t19);
    			append_dev(div2, t20);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div1, t22);
    			if (if_block3) if_block3.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "load", /*onWindowLoad*/ ctx[19], false, false, false),
    					listen_dev(window_1, "focus", /*onWindowLoad*/ ctx[19], false, false, false),
    					listen_dev(button, "click", /*click_handler_5*/ ctx[26], false, false, false),
    					listen_dev(div3, "click", stop_propagation(/*click_handler_7*/ ctx[28]), false, false, true),
    					listen_dev(div4, "click", /*click_handler_8*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*companionContent*/ ctx[11]) if_block2.p(ctx, dirty);
    			if ((!current || dirty[0] & /*license*/ 128) && t11_value !== (t11_value = /*license*/ ctx[7].key + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty[0] & /*license*/ 128) && t15_value !== (t15_value = dayjs_min(/*license*/ ctx[7].firstUsedAt).format("dddd, MMMM D, YYYY h:mm A") + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty[0] & /*license*/ 128) && t19_value !== (t19_value = dayjs_min(/*license*/ ctx[7].expiresAt).format("dddd, MMMM D, YYYY h:mm A") + "")) set_data_dev(t19, t19_value);

    			if (/*devMode*/ ctx[0]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty[0] & /*aboutModalActive*/ 64 && div4_class_value !== (div4_class_value = "fixed " + (!/*aboutModalActive*/ ctx[6] ? 'hidden' : '') + " z-50 inset-0 bg-black bg-opacity-70 overflow-y-auto h-full w-full")) {
    				attr_dev(div4, "class", div4_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div4);
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function loadPlaylistWithKey(key, section) {
    	var items = [
    		{
    			key: "0JVN2uLaY88",
    			thumbnail: "https://i.ytimg.com/vi/0JVN2uLaY88/default.jpg",
    			title: section + ": To Be a Great Engineering Manager, Be Boring",
    			duration: 119,
    			publishedAt: "2022-06-23T18:38:01Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "jRPH2yWSbDw",
    			thumbnail: "https://i.ytimg.com/vi/jRPH2yWSbDw/default.jpg",
    			title: section + ": The 3.5 Things to Consider When Picking Technologies | Engineering Leadership",
    			duration: 168,
    			publishedAt: "2022-06-23T18:13:57Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "WX5Ax9-PoHY",
    			thumbnail: "https://i.ytimg.com/vi/WX5Ax9-PoHY/default.jpg",
    			title: section + ": Should an engineering manager still write code?",
    			duration: 70,
    			publishedAt: "2022-06-23T18:26:00Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "lzsgAe-MyyM",
    			thumbnail: "https://i.ytimg.com/vi/lzsgAe-MyyM/default.jpg",
    			title: section + ": #FOCUS | Steal This Team Alignment Practice",
    			duration: 140,
    			publishedAt: "2022-06-23T18:24:44Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "kdxdI5zs_p0",
    			thumbnail: "https://i.ytimg.com/vi/kdxdI5zs_p0/default.jpg",
    			title: section + ": Run Better Standups | Engineering Leadership",
    			duration: 60,
    			publishedAt: "2022-06-23T18:04:56Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "n3c1DjprPd0",
    			thumbnail: "https://i.ytimg.com/vi/n3c1DjprPd0/default.jpg",
    			title: section + ": Software Development Project Planning Tips | Engineering Management",
    			duration: 124,
    			publishedAt: "2022-06-23T18:13:24Z",
    			premium: randomBoolean()
    		},
    		{
    			key: "YSouXkUg6E4",
    			thumbnail: "https://i.ytimg.com/vi/YSouXkUg6E4/default.jpg",
    			title: section + ": 3 Key Dev Team Metrics | Engineering Leadership",
    			duration: 174,
    			publishedAt: "2022-06-23T18:32:19Z",
    			premium: randomBoolean()
    		}
    	];

    	// select a random set of 4 videos
    	var shuffled = items.sort(() => 0.5 - Math.random());

    	var selected = shuffled.slice(0, 4);

    	return {
    		key,
    		itemCount: 4,
    		duration: Math.floor(Math.random() * 6000),
    		items: selected
    	};
    }

    function randomBoolean() {
    	return Math.random() > 0.5;
    }

    function playlistCountDisplay(count) {
    	if (!count) {
    		return "";
    	}

    	var label = "videos";

    	if (count === 1) {
    		label = "video";
    	}

    	return count + " " + label;
    }

    function playlistDurationDisplay(seconds) {
    	if (!seconds) {
    		return "";
    	}

    	var hours = Math.floor(seconds / 3600);
    	seconds = seconds - 3600 * hours;
    	var minutes = Math.round(seconds / 60);
    	var str = minutes + " mins";

    	if (hours > 0) {
    		var label = "hrs";

    		if (hours === 1) {
    			label = "hr";
    		}

    		str = hours + " " + label + " " + str;
    	}

    	return str;
    }

    function videoDurationDisplay(seconds) {
    	if (!seconds) {
    		return "";
    	}

    	var hours = Math.floor(seconds / 3600);
    	seconds = seconds - 3600 * hours;
    	var minutes = Math.floor(seconds / 60);
    	seconds = seconds - 60 * minutes;
    	var str = ":" + String(seconds).padStart(2, "0");

    	if (hours > 0) {
    		str = hours + ":" + String(minutes).padStart(2, "0");
    	} else {
    		str = minutes + str;
    	}

    	return str;
    }

    function initLicense() {
    	return {
    		key: null,
    		active: false,
    		expired: false,
    		expiresAt: null,
    		lastCheckedAt: null
    	};
    }

    function noop() {
    	
    } // noop

    function instance($$self, $$props, $$invalidate) {
    	let licenseKeyAreaOverlayActive;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let devMode = false;
    	let indexContent = false;
    	let coachingContent = false;
    	let companionContent = true;
    	let licenseKeyAreaActive = false;
    	let licenseKeyErrorText = null;
    	let activeSection = "home";

    	// url structure
    	// companion.html?section=home
    	// companion.html?section=framework
    	// companion.html?section=product:deliver&video=YTVIDEOKEY
    	let sections = {
    		home: {
    			pretitle: "Welcome to",
    			title: "The Engineering Manager's Companion",
    			// subtitle: "a video compendium for software development leaders",
    			titleImage: "/assets/img/thumb-home.png",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		framework: {
    			pretitle: "Introducing",
    			title: "The Machine",
    			subtitle: "a framework for leading teams",
    			titleImage: "/assets/img/thumb-framework.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"product:deliver": {
    			pretitle: "Product Responsibility 1",
    			title: "Deliver software.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-product-deliver.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"product:balance": {
    			pretitle: "Product Responsibility 2",
    			title: "Balance features and fixes.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-product-balance.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"product:engineers": {
    			pretitle: "Product Responsibility 3",
    			title: "Inspire engineers to build the product.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-product-engineers.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"product:users": {
    			pretitle: "Product Responsibility 4",
    			title: "Inspire users to champion the product.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-product-users.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"people:attract": {
    			pretitle: "People Responsibility 1",
    			title: "Attract, retain, and grow talent.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-people-attract.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"people:structure": {
    			pretitle: "People Responsibility 2",
    			title: "Structure and organize the team.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-people-structure.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"people:motivate": {
    			pretitle: "People Responsibility 3",
    			title: "Motivate and inspire the team.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-people-motivate.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"process:time": {
    			pretitle: "Process Responsibility 1",
    			title: "Deliver on time.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-process-time.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"process:budget": {
    			pretitle: "Process Responsibility 2",
    			title: "Deliver on budget.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-process-budget.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"process:quality": {
    			pretitle: "Process Responsibility 3",
    			title: "Deliver with quality.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-process-quality.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"process:stakeholders": {
    			pretitle: "Process Responsibility 4",
    			title: "Keep all stakeholders well-informed.",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-process-stakeholders.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"potpourri:guidance": {
    			pretitle: "Assorted",
    			title: "Guidance and advice",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-potpourri-guidance.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		},
    		"potpourri:scenarios": {
    			pretitle: "Challenging",
    			title: "Management scenarios",
    			subtitle: "37 videos, 19 mins",
    			titleImage: "/assets/img/thumb-potpourri-scenarios.jpg",
    			playlist: {
    				key: "PLS847SR-j-ZcpPFn8J-vCJuy4lGsIX6Nl",
    				items: []
    			}
    		}
    	};

    	// updates the 'sections' state variable in place,
    	// hydrating the section playlist information
    	function loadSectionPlaylist(section) {
    		var key = sections[section].playlist.key;

    		if (sections[section].playlist.loaded) {
    			console.log(section + " playlist already loaded, returning fast.");
    			return;
    		}

    		console.log(section + " playlist: LOADING...");
    		var playlist = loadPlaylistWithKey(key, section);
    		console.log(playlist);
    		$$invalidate(4, sections[section].playlist.items = playlist.items, sections);
    		$$invalidate(4, sections[section].playlist.count = playlist.itemCount, sections);
    		$$invalidate(4, sections[section].playlist.duration = playlist.duration, sections);
    		$$invalidate(4, sections[section].playlist.loaded = true, sections);
    	}

    	let activeVideo = {
    		key: "WX5Ax9-PoHY",
    		title: "Should an engineering manager still write code?",
    		description: 'This is an age-old question bordering on the religious. In my opinion, it\'s not a matter of "should" or team size.',
    		premium: false
    	};

    	let validatingLicenseKey = false;
    	let aboutModalActive = false;
    	var localhost_regex = /localhost/;

    	if (localhost_regex.test(window.location.href)) {
    		devMode = true;
    	}

    	let now = dayjs_min(new Date());
    	let license = initLicense();

    	function checkLicenseKey(e) {
    		const { name, value } = e.target;

    		if (licenseKeyErrorText) {
    			$$invalidate(2, licenseKeyErrorText = null);
    		}

    		if (value.length != 36) {
    			return;
    		}

    		console.log("We have a 36-character license key entry: " + value);
    		validateLicenseKey(value);
    	}

    	function validateLicenseKey(key) {
    		$$invalidate(20, validatingLicenseKey = true);
    		$$invalidate(2, licenseKeyErrorText = null); // reset any error message
    		key = key.trim();
    		var endpoint = "https://api.verkout.com/license_keys/" + key + "/use";

    		var requestOptions = {
    			method: "PUT",
    			headers: { "Content-Type": "application/json" }
    		};

    		fetch(endpoint, requestOptions).then(res => {
    			console.log("got a response....");
    			console.log(res);
    			return res.json();
    		}).then(data => {
    			console.log("...and here's the structured info:");
    			console.log(data);

    			if (data.errors) {
    				$$invalidate(8, licenseKeyAreaOverlayActive = false);
    				var error = data.errors[0];
    				$$invalidate(2, licenseKeyErrorText = error.detail);

    				if (error.expiredAt) {
    					$$invalidate(2, licenseKeyErrorText = licenseKeyErrorText + " It expired on " + dayjs_min(error.expiredAt).format("dddd, MMMM D, YYYY h:mm A") + ".");
    				} else if (error.revokedAt) {
    					$$invalidate(2, licenseKeyErrorText = licenseKeyErrorText + " It was revoked on " + dayjs_min(error.revokedAt).format("dddd, MMMM D, YYYY h:mm A") + ".");
    				}
    			} else if (data.license) {
    				$$invalidate(8, licenseKeyAreaOverlayActive = false);
    				$$invalidate(7, license.key = data.license.key, license);
    				$$invalidate(7, license.firstUsedAt = data.license.firstUsedAt, license);
    				$$invalidate(7, license.expiresAt = data.license.expiresAt, license);
    				$$invalidate(7, license.active = true, license);
    				localStorage.setItem("license", JSON.stringify(license));
    			}
    		});
    	}

    	if (companionContent) {
    		const storedLicense = localStorage.getItem("license");

    		if (storedLicense) {
    			license = JSON.parse(storedLicense);

    			if (license.key) {
    				validateLicenseKey(license.key);
    			}
    		}
    	}

    	function toggleLicenseKeyArea() {
    		$$invalidate(1, licenseKeyAreaActive = !licenseKeyAreaActive);
    	}

    	function openLicenseKeyArea() {
    		console.log("open license key area");
    		$$invalidate(1, licenseKeyAreaActive = true);
    	}

    	function toggleAboutModal() {
    		$$invalidate(6, aboutModalActive = !aboutModalActive);
    	}

    	function handleSelectSection(section) {
    		activateSection(section);
    		clearActiveVideo();
    		updateSiteUrl();
    		activateFirstVideo();
    	}

    	function handleSelectVideo(key) {
    		if (key && key != "undefined" && key != undefined) {
    			activateVideo(key);
    			updateSiteUrl();
    		}
    	}

    	function activateSection(section) {
    		console.log("in App with active section " + section);
    		$$invalidate(3, activeSection = section);
    		loadSectionPlaylist(section);
    	}

    	function clearActiveVideo() {
    		$$invalidate(5, activeVideo = {
    			key: null,
    			title: null,
    			description: null
    		});
    	}

    	function activateFirstVideo() {
    		console.log("activateFirstVideo()...first in playlist is...");
    		var item = sections[activeSection].playlist.items[0];
    		console.log(item);
    		$$invalidate(5, activeVideo.key = item.key, activeVideo);
    		console.log("gonna activateVideo with key " + item.key);
    		activateVideo(item.key);
    	}

    	function activateVideo(key, attempt) {
    		console.log("activateVideo(" + key + ") attempt " + attempt);
    		$$invalidate(5, activeVideo.key = key, activeVideo);

    		// fill in some basic details from playlist
    		var playlistItem = sections[activeSection].playlist.items.find(item => item.key === key);

    		$$invalidate(5, activeVideo.title = playlistItem.title, activeVideo);
    		$$invalidate(5, activeVideo.premium = playlistItem.premium, activeVideo);
    		$$invalidate(5, activeVideo.thumbnail = playlistItem.thumbnail, activeVideo);
    		$$invalidate(5, activeVideo.thumbnailLarge = playlistItem.thumbnail.replace("default", "sddefault"), activeVideo);

    		setTimeout(
    			function () {
    				scrollToActivePlaylistItem();
    			},
    			500
    		);

    		if (activeVideo.premium && !license.active) {
    			console.log("premium content...not gonna play the video...gonna stop any existing video");

    			if (ytplayerReady) {
    				ytplayer.stopVideo();
    			}

    			return;
    		} else {
    			if (!ytplayerReady) {
    				attempt = attempt || 1;

    				setTimeout(
    					function () {
    						activateVideo(key, attempt + 1);
    					},
    					attempt * 1000
    				);
    			} else {
    				var playerState = ytplayer.getPlayerState();
    				console.log("getting ytplayer.getVideoData()..");
    				var videoData = ytplayer.getVideoData();
    				console.log(videoData);
    				var videoId = videoData["video_id"];

    				if (key != videoId || playerState === 0 || playerState === -1) {
    					console.log("loading video, looks unstarted or ended");
    					ytplayer.loadVideoById(activeVideo.key);
    				}
    			}
    		}
    	} // TODO: load enriched video details

    	function updateSiteUrl() {
    		var url = "companion.html?section=" + activeSection;

    		if (activeVideo.key) {
    			url = url + "&video=" + activeVideo.key;
    		}

    		window.history.pushState({}, activeSection, url);
    	}

    	function clearLicense() {
    		localStorage.removeItem("license");
    		$$invalidate(7, license = initLicense());
    	}

    	function scrollToActivePlaylistItem() {
    		console.log("scrolling to active playlist item with key " + activeVideo.key + " and title " + activeVideo.title);

    		scrollTo({
    			container: "#playlist-container",
    			element: "#video-" + activeVideo.key
    		});
    	}

    	function onWindowLoad() {
    		var queryString = window.location.search;
    		console.log("current site queryString is " + queryString);
    		const urlParams = new URLSearchParams(queryString);
    		const section = urlParams.get("section");
    		console.log(section);

    		if (section) {
    			activateSection(section);
    		} else {
    			activateSection("home");
    		}

    		const video = urlParams.get("video");
    		console.log(video);

    		if (video) {
    			activateVideo(video);
    		} else {
    			// no video param specified...pick the
    			// first video in the active section's playlist
    			activateFirstVideo();
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => clearLicense();
    	const click_handler_1 = () => toggleLicenseKeyArea();
    	const click_handler_2 = () => openLicenseKeyArea();
    	const click_handler_3 = () => toggleLicenseKeyArea();
    	const click_handler_4 = item => handleSelectVideo(item.key);
    	const click_handler_5 = () => toggleAboutModal();
    	const click_handler_6 = () => clearLicense();
    	const click_handler_7 = () => noop();
    	const click_handler_8 = () => toggleAboutModal();

    	$$self.$capture_state = () => ({
    		IndexPage,
    		CoachingPage,
    		BuyButton,
    		Icon,
    		NavItem,
    		PremiumTag,
    		dayjs: dayjs_min,
    		Jumper,
    		Pulse,
    		animateScroll,
    		devMode,
    		indexContent,
    		coachingContent,
    		companionContent,
    		licenseKeyAreaActive,
    		licenseKeyErrorText,
    		activeSection,
    		sections,
    		loadSectionPlaylist,
    		loadPlaylistWithKey,
    		randomBoolean,
    		activeVideo,
    		playlistCountDisplay,
    		playlistDurationDisplay,
    		videoDurationDisplay,
    		validatingLicenseKey,
    		aboutModalActive,
    		localhost_regex,
    		now,
    		license,
    		initLicense,
    		checkLicenseKey,
    		validateLicenseKey,
    		toggleLicenseKeyArea,
    		openLicenseKeyArea,
    		toggleAboutModal,
    		handleSelectSection,
    		handleSelectVideo,
    		activateSection,
    		clearActiveVideo,
    		activateFirstVideo,
    		activateVideo,
    		updateSiteUrl,
    		noop,
    		clearLicense,
    		scrollToActivePlaylistItem,
    		onWindowLoad,
    		licenseKeyAreaOverlayActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('devMode' in $$props) $$invalidate(0, devMode = $$props.devMode);
    		if ('indexContent' in $$props) $$invalidate(9, indexContent = $$props.indexContent);
    		if ('coachingContent' in $$props) $$invalidate(10, coachingContent = $$props.coachingContent);
    		if ('companionContent' in $$props) $$invalidate(11, companionContent = $$props.companionContent);
    		if ('licenseKeyAreaActive' in $$props) $$invalidate(1, licenseKeyAreaActive = $$props.licenseKeyAreaActive);
    		if ('licenseKeyErrorText' in $$props) $$invalidate(2, licenseKeyErrorText = $$props.licenseKeyErrorText);
    		if ('activeSection' in $$props) $$invalidate(3, activeSection = $$props.activeSection);
    		if ('sections' in $$props) $$invalidate(4, sections = $$props.sections);
    		if ('activeVideo' in $$props) $$invalidate(5, activeVideo = $$props.activeVideo);
    		if ('validatingLicenseKey' in $$props) $$invalidate(20, validatingLicenseKey = $$props.validatingLicenseKey);
    		if ('aboutModalActive' in $$props) $$invalidate(6, aboutModalActive = $$props.aboutModalActive);
    		if ('localhost_regex' in $$props) localhost_regex = $$props.localhost_regex;
    		if ('now' in $$props) now = $$props.now;
    		if ('license' in $$props) $$invalidate(7, license = $$props.license);
    		if ('licenseKeyAreaOverlayActive' in $$props) $$invalidate(8, licenseKeyAreaOverlayActive = $$props.licenseKeyAreaOverlayActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*validatingLicenseKey*/ 1048576) {
    			$$invalidate(8, licenseKeyAreaOverlayActive = validatingLicenseKey);
    		}
    	};

    	return [
    		devMode,
    		licenseKeyAreaActive,
    		licenseKeyErrorText,
    		activeSection,
    		sections,
    		activeVideo,
    		aboutModalActive,
    		license,
    		licenseKeyAreaOverlayActive,
    		indexContent,
    		coachingContent,
    		companionContent,
    		checkLicenseKey,
    		toggleLicenseKeyArea,
    		openLicenseKeyArea,
    		toggleAboutModal,
    		handleSelectSection,
    		handleSelectVideo,
    		clearLicense,
    		onWindowLoad,
    		validatingLicenseKey,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
