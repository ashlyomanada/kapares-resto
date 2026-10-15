import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { createRequire } from 'node:module';
import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, ref, watchEffect, onScopeDispose, isRef, toValue, toRef, defineComponent, resolveComponent, shallowRef, h, unref, computed, onServerPrefetch, watch, nextTick, queuePostFlushCb, createElementBlock, provide, cloneVNode, createApp, onErrorCaptured, createVNode, resolveDynamicComponent, defineAsyncComponent, mergeProps, withCtx, useId, renderSlot, openBlock, createBlock, camelize, toRefs, isVNode, createCommentVNode, shallowReadonly, Fragment, renderList, useSlots, toDisplayString, useTemplateRef, createTextVNode, withModifiers, normalizeProps, guardReactiveProps, normalizeStyle, toHandlerKey, Teleport, Comment, useModel, mergeModels, markRaw, isReadonly, useSSRContext, Suspense, isShallow, isReactive, toRaw, readonly, customRef } from 'vue';
import { createHash } from 'node:crypto';
import { Buffer as Buffer$1 } from 'node:buffer';
import Bt from 'node:http';
import zs from 'node:https';
import st from 'node:zlib';
import me, { PassThrough, pipeline } from 'node:stream';
import { promisify, deprecate, types } from 'node:util';
import { format as format$1 } from 'node:url';
import { isIP } from 'node:net';
import { promises, statSync, createReadStream } from 'node:fs';
import { basename } from 'node:path';
import { b as baseURL } from '../routes/renderer.mjs';
import colors from 'tailwindcss/colors';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderSlot, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	__defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __require = /* #__PURE__ */ (() => createRequire(globalThis._importMeta_.url))();

var captureStackTrace = Error.captureStackTrace;
var Diagnostic = class Diagnostic extends Error {
	name;
	/**
	* The diagnostic code, e.g. `MATH_E001`.
	* Also appears as the `name` property.
	*/
	code;
	/**
	* URL to extended documentation for this diagnostic code.
	* Auto-generated from {@link DefineDiagnosticsOptions.docsBase}.
	*/
	docs;
	/**
	* Optional actionable instructions on how to resolve the problem.
	*/
	fix;
	/**
	* Locations in user code that contributed to this diagnostic, in
	* `file:line:column` format. Relevant when the stack trace doesn't reflect
	* the user's source (e.g. compilers, bundlers), otherwise redundant with the
	* stack and should be omitted.
	*/
	sources;
	/**
	* Structured information associated with this diagnostic code.
	*/
	data;
	/**
	* Alias for {@link Error.message}: the reason this diagnostic was raised.
	*/
	get why() {
		return this.message;
	}
	/**
	* @param init        structured initializer; `why` is required
	* @param captureFrom V8 stack-cutoff frame. Defaults to {@link Diagnostic}
	* so the top of the trace is the `new Diagnostic(...)` call site.
	* `defineDiagnostics` passes its action method to strip its own frames too.
	* Ignored on engines without `Error.captureStackTrace`.
	*/
	constructor(init, captureFrom = Diagnostic) {
		super(init.why, { cause: init.cause });
		this.code = this.name = init.code;
		this.fix = init.fix;
		this.docs = init.docs;
		this.sources = init.sources;
		this.data = init.data;
		captureStackTrace?.(this, captureFrom);
	}
	/**
	* Converts the diagnostic into a serializable structured object.
	*/
	toJSON() {
		return {
			name: this.name,
			why: this.why,
			fix: this.fix,
			docs: this.docs,
			sources: this.sources,
			cause: this.cause,
			data: this.data,
			stack: this.stack
		};
	}
};
/**
* Resolves the docs URL for a code from a `docsBase` (string template or
* resolver function). Shared by {@link defineDiagnostics} and
* {@link defineProdDiagnostics}. Per-code `docs` overrides are handled by the
* caller; this only covers the `docsBase`-derived case.
*
* @internal
*/
function deriveDocs(docsBase, code) {
	return typeof docsBase === "string" ? `${docsBase}/${code.toLowerCase()}` : docsBase?.(code);
}
/**
* Production counterpart to {@link defineDiagnostics}. Returns a `Proxy` that
* builds a minimal {@link Diagnostic} for any accessed code: the code becomes
* the instance `name`, `docs` is derived from `docsBase`, and `why` points to
* the docs URL when one exists (empty otherwise, so the thrown header is just
* the code). It carries no catalog text or data, so it stays tiny in a bundle.
*
* The strip plugin (`@nostics/unplugin`) can rewrite a `defineDiagnostics()`
* call into a `"production" === 'production'` ternary that selects this
* factory in production, dropping every `why`/`fix` string from the bundle.
*
* @example
* ```ts
* const diagnostics = defineProdDiagnostics({ docsBase: 'https://docs.example.com' })
* throw diagnostics.NUXT_B2011() // NUXT_B2011: https://docs.example.com/nuxt_b2011
* ```
*/
/* @__NO_SIDE_EFFECTS__ */
function defineProdDiagnostics(options = {}) {
	const { docsBase, reporters = [] } = options;
	return new Proxy({}, { get(_target, code) {
		if (typeof code !== "string") return void 0;
		const handle = (params = {}, reporterOptions = {}) => {
			const docs = deriveDocs(docsBase, code);
			const diagnostic = new Diagnostic({
				code,
				why: docs ?? "",
				docs,
				cause: params.cause,
				sources: params.sources
			}, handle);
			for (const reporter of reporters) reporter(diagnostic, reporterOptions);
			return diagnostic;
		};
		return handle;
	} });
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/unctx@3.0.1_magic-string@1.4.3_rolldown@1.2.14_unplugin@3.4.0_esbuild@0.28.2_rolldown@1.2.14__3dg63cazpdacphzqkfjwaul5tu/node_modules/unctx/dist/index.mjs
function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
var _WeakRef = globalThis.WeakRef || class StrongRef {
	#value;
	constructor(value) {
		this.#value = value;
	}
	deref() {
		return this.#value;
	}
};
function createContext$1(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new _WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance() ?? null;
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext$1({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
var _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
var globalKey = "__unctx__";
var defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
var getContext$1 = (key, opts = {}) => defaultNamespace.get(key, opts);
var asyncHandlersKey = "__unctx_async_handlers__";
var asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
	const restores = [];
	for (const leaveHandler of asyncHandlers) {
		const restore = leaveHandler();
		if (restore) restores.push(restore);
	}
	const restore = () => {
		for (const restore of restores) restore();
	};
	let awaitable = function_();
	if (awaitable && typeof awaitable === "object" && "catch" in awaitable) awaitable = awaitable.catch((error) => {
		restore();
		throw error;
	});
	return [awaitable, restore];
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/internal/context.js
globalThis.__nuxt_app_ctx__ ||= {};
function getContext(key, opts) {
	return getContext$1(key, opts);
}
//#endregion
//#region node_modules/.pnpm/hookable@6.1.2/node_modules/hookable/dist/index.mjs
function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
var createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks$1(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks$1(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks$1(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
var asyncDataDefaults = { "deep": false };
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.6.1";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const runHooks = async (hooks, args) => {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		const contextCaller = runHooks;
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	let error;
	for (const plugin of plugins) try {
		await applyPlugin(nuxtApp, plugin);
	} catch (e) {
		if (!nuxtApp.payload.error) throw e;
		error ||= e;
	}
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/unhead@3.4.3_esbuild@0.28.2_rolldown@1.2.14_rollup@4.64.7_vite@8.3.4_esbuild@0.28.2_jiti@2.7.0_terser@5.51.2_/node_modules/unhead/dist/shared/unhead.CGPOfp5O.mjs
// @__NO_SIDE_EFFECTS__
function isUnsafeKey(key) {
	return key === "__proto__" || key === "constructor" || key === "prototype";
}
//#endregion
//#region node_modules/.pnpm/unhead@3.4.3_esbuild@0.28.2_rolldown@1.2.14_rollup@4.64.7_vite@8.3.4_esbuild@0.28.2_jiti@2.7.0_terser@5.51.2_/node_modules/unhead/dist/shared/unhead.DJuZwX9c.mjs
function walkResolver(val, resolve, key) {
	if (key === "_resolver") return val;
	if (typeof val === "function" && (!key || key !== "titleTemplate" && !key.startsWith("on"))) val = val();
	const v = resolve ? resolve(key, val) : val;
	if (Array.isArray(v)) {
		let out;
		for (let i = 0; i < v.length; i++) {
			const r = walkResolver(v[i], resolve);
			if (out) out[i] = r;
			else if (r !== v[i]) {
				out = v.slice(0, i);
				out[i] = r;
			}
		}
		return out || v;
	}
	if (v?.constructor === Object) {
		let next;
		for (const k in v) {
			const unsafe = /* @__PURE__ */ isUnsafeKey(k);
			const r = unsafe ? void 0 : walkResolver(v[k], resolve, k);
			if (!next && (unsafe || r !== v[k])) {
				next = {};
				for (const pk in v) {
					if (pk === k) break;
					next[pk] = v[pk];
				}
			}
			if (next && !unsafe) next[k] = r;
		}
		return next || v;
	}
	return v;
}
//#endregion
//#region node_modules/.pnpm/@unhead+vue@3.4.3_@oxc-project+types@0.154.0_esbuild@0.28.2_lightningcss@1.33.0_rolldown@1.2._awehrzjm7uqxvdjo4ijmd3bnsu/node_modules/@unhead/vue/dist/shared/vue.DKb5ZKVl.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead$1() {
	if (hasInjectionContext()) {
		const instance = inject(headSymbol);
		if (instance) return instance;
	}
	throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
//#endregion
//#region node_modules/.pnpm/@unhead+vue@3.4.3_@oxc-project+types@0.154.0_esbuild@0.28.2_lightningcss@1.33.0_rolldown@1.2._awehrzjm7uqxvdjo4ijmd3bnsu/node_modules/@unhead/vue/dist/shared/vue.D2XR8FqS.mjs
var VueResolver = /* @__PURE__ */ Object.assign((_, value) => isRef(value) ? toValue(value) : value, { _static: true });
//#endregion
//#region node_modules/.pnpm/@unhead+vue@3.4.3_@oxc-project+types@0.154.0_esbuild@0.28.2_lightningcss@1.33.0_rolldown@1.2._awehrzjm7uqxvdjo4ijmd3bnsu/node_modules/@unhead/vue/dist/shared/vue.CXwiCT15.mjs
function useHead$1(input, options = {}) {
	const head = options.head || /* @__PURE__ */ injectHead$1();
	return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
	const scope = getCurrentScope();
	if (scope && !scope.active) return {
		patch() {},
		dispose() {},
		_i: -1
	};
	const deactivated = ref(false);
	if (options.onRendered && scope) {
		const _onRendered = options.onRendered;
		options = {
			...options,
			onRendered: (ctx) => scope.run(() => _onRendered(ctx))
		};
	}
	let entry;
	watchEffect(() => {
		const i = deactivated.value ? {} : walkResolver(input, VueResolver);
		if (entry) entry.patch(i);
		else entry = head.push(i, options);
	});
	if (getCurrentInstance()) ; else if (scope) onScopeDispose(() => entry.dispose());
	return entry;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject("usehead");
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead(input, options = {}) {
	return useHead$1(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}

var HASH_RE$2 = /#/g;
var AMPERSAND_RE$1 = /&/g;
var SLASH_RE$1 = /\//g;
var EQUAL_RE$1 = /=/g;
var PLUS_RE$1 = /\+/g;
var ENC_CARET_RE$1 = /%5e/gi;
var ENC_BACKTICK_RE$1 = /%60/gi;
var ENC_PIPE_RE$2 = /%7c/gi;
var ENC_SPACE_RE$1 = /%20/gi;
var ENC_SLASH_RE = /%2f/gi;
function encode(text) {
	return encodeURI("" + text).replace(ENC_PIPE_RE$2, "|");
}
function encodeQueryValue$1(input) {
	return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE$1, "%2B").replace(ENC_SPACE_RE$1, "+").replace(HASH_RE$2, "%23").replace(AMPERSAND_RE$1, "%26").replace(ENC_BACKTICK_RE$1, "`").replace(ENC_CARET_RE$1, "^").replace(SLASH_RE$1, "%2F");
}
function encodeQueryKey$1(text) {
	return encodeQueryValue$1(text).replace(EQUAL_RE$1, "%3D");
}
function decode$2(text = "") {
	try {
		return decodeURIComponent("" + text);
	} catch {
		return "" + text;
	}
}
function decodePath(text) {
	return decode$2(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
	return decode$2(text.replace(PLUS_RE$1, " "));
}
function decodeQueryValue(text) {
	return decode$2(text.replace(PLUS_RE$1, " "));
}
function parseQuery$1(parametersString = "") {
	const object = /* @__PURE__ */ Object.create(null);
	if (parametersString[0] === "?") parametersString = parametersString.slice(1);
	for (const parameter of parametersString.split("&")) {
		const s = parameter.match(/([^=]+)=?(.*)/) || [];
		if (s.length < 2) continue;
		const key = decodeQueryKey(s[1]);
		if (key === "__proto__" || key === "constructor") continue;
		const value = decodeQueryValue(s[2] || "");
		if (object[key] === void 0) object[key] = value;
		else if (Array.isArray(object[key])) object[key].push(value);
		else object[key] = [object[key], value];
	}
	return object;
}
function encodeQueryItem(key, value) {
	if (typeof value === "number" || typeof value === "boolean") value = String(value);
	if (!value) return encodeQueryKey$1(key);
	if (Array.isArray(value)) return value.map((_value) => `${encodeQueryKey$1(key)}=${encodeQueryValue$1(_value)}`).join("&");
	return `${encodeQueryKey$1(key)}=${encodeQueryValue$1(value)}`;
}
function stringifyQuery$1(query) {
	return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}
var PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
var PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
var PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
var PROTOCOL_SCRIPT_RE = /^[\s\0]*(blob|data|javascript|vbscript):$/i;
var TRAILING_SLASH_RE$1 = /\/$|\/\?|\/#/;
var JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
	if (typeof opts === "boolean") opts = { acceptRelative: opts };
	if (opts.strict) return PROTOCOL_STRICT_REGEX.test(inputString);
	return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function isScriptProtocol(protocol) {
	return !!protocol && PROTOCOL_SCRIPT_RE.test(protocol);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/");
	return TRAILING_SLASH_RE$1.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
	if (!hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
	}
	const [s0, ...s] = path.split("?");
	return ((s0.endsWith("/") ? s0.slice(0, -1) : s0) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
	if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
	if (hasTrailingSlash(input, true)) return input || "/";
	let path = input;
	let fragment = "";
	const fragmentIndex = input.indexOf("#");
	if (fragmentIndex !== -1) {
		path = input.slice(0, fragmentIndex);
		fragment = input.slice(fragmentIndex);
		if (!path) return fragment;
	}
	const [s0, ...s] = path.split("?");
	return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withBase(input, base) {
	if (isEmptyURL(base) || hasProtocol(input)) return input;
	const _base = withoutTrailingSlash(base);
	if (input.startsWith(_base)) {
		const nextChar = input[_base.length];
		if (!nextChar || nextChar === "/" || nextChar === "?") return input;
	}
	return joinURL(_base, input);
}
function withQuery(input, query) {
	const parsed = parseURL$1(input);
	parsed.search = stringifyQuery$1({
		...parseQuery$1(parsed.search),
		...query
	});
	return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
	return !url || url === "/";
}
function isNonEmptyURL(url) {
	return url && url !== "/";
}
function joinURL(base, ...input) {
	let url = base || "";
	for (const segment of input.filter((url2) => isNonEmptyURL(url2))) if (url) {
		const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
		url = withTrailingSlash(url) + _segment;
	} else url = segment;
	return url;
}
var protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL$1(input = "", defaultProto) {
	const _specialProtoMatch = input.match(/^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i);
	if (_specialProtoMatch) {
		const [, _proto, _pathname = ""] = _specialProtoMatch;
		return {
			protocol: _proto.toLowerCase(),
			pathname: _pathname,
			href: _proto + _pathname,
			auth: "",
			host: "",
			search: "",
			hash: ""
		};
	}
	if (!hasProtocol(input, { acceptRelative: true })) return parsePath(input);
	const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
	let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
	if (protocol === "file:") path = path.replace(/\/(?=[A-Za-z]:)/, "");
	const { pathname, search, hash } = parsePath(path);
	return {
		protocol: protocol.toLowerCase(),
		auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
		host,
		pathname,
		search,
		hash,
		[protocolRelative]: !protocol
	};
}
function parsePath(input = "") {
	const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
	return {
		pathname,
		search,
		hash
	};
}
function stringifyParsedURL(parsed) {
	const pathname = parsed.pathname || "";
	const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
	const hash = parsed.hash || "";
	const auth = parsed.auth ? parsed.auth + "@" : "";
	const host = parsed.host || "";
	return (parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "") + auth + host + pathname + search + hash;
}
//#endregion
//#region node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
	if (Symbol.iterator in value) return false;
	if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
	return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
	if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace);
	const object = { ...defaults };
	for (const key of Object.keys(baseObject)) {
		if (key === "__proto__" || key === "constructor") continue;
		const value = baseObject[key];
		if (value === null || value === void 0) continue;
		if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
		else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString());
		else object[key] = value;
	}
	return object;
}
function createDefu(merger) {
	return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, ""), {});
}
var defu = createDefu();
//#endregion
//#region node_modules/.pnpm/h3@1.15.11/node_modules/h3/dist/index.mjs
function hasProp(obj, prop) {
	try {
		return prop in obj;
	} catch {
		return false;
	}
}
var H3Error = class extends Error {
	static __h3_error__ = true;
	statusCode = 500;
	fatal = false;
	unhandled = false;
	statusMessage;
	data;
	cause;
	constructor(message, opts = {}) {
		super(message, opts);
		if (opts.cause && !this.cause) this.cause = opts.cause;
	}
	toJSON() {
		const obj = {
			message: this.message,
			statusCode: sanitizeStatusCode(this.statusCode, 500)
		};
		if (this.statusMessage) obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
		if (this.data !== void 0) obj.data = this.data;
		return obj;
	}
};
function createError$1(input) {
	if (typeof input === "string") return new H3Error(input);
	if (isError(input)) return input;
	const err = new H3Error(input.message ?? input.statusMessage ?? "", { cause: input.cause || input });
	if (hasProp(input, "stack")) try {
		Object.defineProperty(err, "stack", { get() {
			return input.stack;
		} });
	} catch {
		try {
			err.stack = input.stack;
		} catch {}
	}
	if (input.data) err.data = input.data;
	if (input.statusCode) err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
	else if (input.status) err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
	if (input.statusMessage) err.statusMessage = input.statusMessage;
	else if (input.statusText) err.statusMessage = input.statusText;
	if (err.statusMessage) {
		const originalMessage = err.statusMessage;
		if (sanitizeStatusMessage(err.statusMessage) !== originalMessage) console.warn("[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default.");
	}
	if (input.fatal !== void 0) err.fatal = input.fatal;
	if (input.unhandled !== void 0) err.unhandled = input.unhandled;
	return err;
}
function isError(input) {
	return input?.constructor?.__h3_error__ === true;
}
var DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
	return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
	if (!statusCode) return defaultStatusCode;
	if (typeof statusCode === "string") statusCode = Number.parseInt(statusCode, 10);
	if (statusCode < 100 || statusCode > 999) return defaultStatusCode;
	return statusCode;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError = (error) => {
	if (isNuxtError(error)) return error;
	if (typeof error !== "string" && error?.statusText) error.message ??= error.statusText;
	const nuxtError = createError$1(error ?? {});
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/utils.js
var PROBE_BASE_A = "https://a.invalid/probe/";
var PROBE_BASE_B = "https://b.invalid/probe/";
function parseAnchorURL(value, base = PROBE_BASE_A) {
	try {
		return new URL(value, base);
	} catch {
		return null;
	}
}
/** Whether a URL string is a path rooted at the current origin, so carries no protocol. */
function isRootedPath(value) {
	return value[0] === "/" && value[1] !== "/" && value[1] !== "\\";
}
/** Whether a URL string carries its own protocol or authority. */
function isAbsoluteHref(value) {
	if (!value || isRootedPath(value)) return false;
	const resolved = parseAnchorURL(value);
	return !!resolved && resolved.href === parseAnchorURL(value, PROBE_BASE_B)?.href;
}
/** The script-capable protocol a URL string would navigate to, or `null` when it is safe. */
function getScriptProtocol(value) {
	if (!value || isRootedPath(value)) return null;
	let resolved = parseAnchorURL(value.replace(/[\u0000-\u001F\u007F\s]+/g, ""));
	while (resolved?.protocol === "view-source:") resolved = parseAnchorURL(resolved.pathname);
	if (!resolved) return "";
	return isScriptProtocol(resolved.protocol) ? resolved.protocol : null;
}
/** Returns the value unchanged when safe to use as an anchor `href`, or `null`. */
function sanitizeAnchorHref(value) {
	return getScriptProtocol(value) === null ? value : null;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var LayoutSymbol = Symbol("layout");
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = (() => {
	return useNuxtApp()?.$router;
});
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function getParentScope(scope) {
	const internal = scope;
	return internal.parent ?? internal.subs?.sub;
}
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = getParentScope(scope);
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = isAbsoluteHref(toPath);
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const protocol = getScriptProtocol(toPath);
		if (protocol !== null) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			let expectedPath = fullPath;
			if (typeof to === "string" && toPath.includes("?")) {
				const target = router.resolve(to);
				expectedPath = router.resolve({
					path: target.path,
					query: target.query,
					hash: target.hash
				}).fullPath || "/";
			}
			router.afterEach((final) => final.fullPath === expectedPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL$1(url);
	return encodeVueRouterPath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
var ENC_PIPE_RE$1 = /%7C/g;
var ENC_BRACKET_OPEN_RE$1 = /%5B/g;
var ENC_BRACKET_CLOSE_RE$1 = /%5D/g;
var ENC_ENC_SLASH_RE = /%252F/gi;
var HASH_RE$1 = /#/g;
var QUESTION_MARK_RE = /\?/g;
/**
* Apply vue-router's own path encoding, which leaves sub-delimiters like `&`
* and `+` literal. This must stay in sync with `encodeVueRouterPath` in
* `unrouting`, which encodes the route records we need to match against.
*/
function encodeVueRouterPath(value) {
	return encodeURI(value).replace(ENC_PIPE_RE$1, "|").replace(ENC_BRACKET_OPEN_RE$1, "[").replace(ENC_BRACKET_CLOSE_RE$1, "]").replace(HASH_RE$1, "%23").replace(QUESTION_MARK_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F");
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/error.js
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	await nuxtApp.runWithContext(() => showError(error));
};
//#endregion
//#region node_modules/.pnpm/vue-router@5.4.0_@vue+compiler-sfc@3.5.44_esbuild@0.28.2_rolldown@1.2.14_rollup@4.64.7_vite@8_7vihob4hvv5x7q25qt5cy355xq/node_modules/vue-router/dist/useApi-CUWMwLLw.js
/*!
* vue-router v5.4.0
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
/**
* Checks if a path is absolute, meaning it starts with a `/`.
*
* @param path - path to check
*
* @internal
*/
var isAbsolutePath = (path) => path.startsWith("/");
/**
* Allows differentiating lazy components from functional components and vue-class-component
* @internal
*
* @param component
*/
function isRouteComponent(component) {
	return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function isESModule(obj) {
	return obj.__esModule || obj[Symbol.toStringTag] === "Module" || obj.default && isRouteComponent(obj.default);
}
var assign = Object.assign;
function applyToParams(fn, params) {
	const newParams = {};
	for (const key in params) {
		const value = params[key];
		newParams[key] = isArray$1(value) ? value.map(fn) : fn(value);
	}
	return newParams;
}
var noop$1 = () => {};
/**
* Typesafe alternative to Array.isArray
* https://github.com/microsoft/TypeScript/pull/48228
*
* @internal
*/
var isArray$1 = Array.isArray;
function mergeOptions(defaults, partialOptions) {
	const options = {};
	for (const key in defaults) options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
	return options;
}
var NavigationFailureSymbol = Symbol("");
/**
* Creates a typed NavigationFailure object.
* @internal
* @param type - NavigationFailureType
* @param params - { from, to }
*/
function createRouterError(type, params) {
	return assign(/* @__PURE__ */ new Error(), {
		type,
		[NavigationFailureSymbol]: true
	}, params);
}
function isNavigationFailure(error, type) {
	return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
/**
* RouteRecord being rendered by the closest ancestor Router View. Used for
* `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
* Location Matched
*
* @internal
*/
var matchedRouteKey = Symbol("");
/**
* Allows overriding the router view depth to control which component in
* `matched` is rendered. rvd stands for Router View Depth
*
* @internal
*/
var viewDepthKey = Symbol("");
/**
* Allows overriding the router instance returned by `useRouter` in tests. r
* stands for router
*
* @internal
*/
var routerKey = Symbol("");
/**
* Allows overriding the current route returned by `useRoute` in tests. rl
* stands for route location
*
* @internal
*/
var routeLocationKey = Symbol("");
/**
* Allows overriding the current route used by router-view. Internally this is
* used when the `route` prop is passed.
*
* @internal
*/
var routerViewLocationKey = Symbol("");
/**
* Callbacks called by the closest ancestor router-view once it displays a new
* route. Used by `onRouteRendered()`.
*
* @internal
*/
var routerViewOnRouteRenderedKey = Symbol("");
/**
* Returns the current route location. Equivalent to using `$route` inside
* templates.
*/
function useRoute(_name) {
	return inject(routeLocationKey);
}
//#endregion
//#region node_modules/.pnpm/vue-router@5.4.0_@vue+compiler-sfc@3.5.44_esbuild@0.28.2_rolldown@1.2.14_rollup@4.64.7_vite@8_7vihob4hvv5x7q25qt5cy355xq/node_modules/vue-router/dist/devtools-CxgSYwGp.js
/*!
* vue-router v5.4.0
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
/**
* Encoding Rules (␣ = Space)
* - Path: ␣ " < > # ? { }
* - Query: ␣ " < > # & =
* - Hash: ␣ " < > `
*
* On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
* defines some extra characters to be encoded. Most browsers do not encode them
* in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
* also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
* plus `-._~`. This extra safety should be applied to query by patching the
* string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
* should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
* into a `/` if directly typed in. The _backtick_ (`````) should also be
* encoded everywhere because some browsers like FF encode it when directly
* written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
*/
/**
* NOTE: `replaceAll()` is not faster than `replace()` with a global RegExp.
* Benchmarks do not show a clear benefit for these simple replacements:
* https://github.com/mathiasbynens/string-prototype-replace-regexp-benchmark
*/
var HASH_RE = /#/g;
var AMPERSAND_RE = /&/g;
var SLASH_RE = /\//g;
var EQUAL_RE = /=/g;
var IM_RE = /\?/g;
var PLUS_RE = /\+/g;
/**
* NOTE: It's not clear to me if we should encode the + symbol in queries, it
* seems to be less flexible than not doing so and I can't find out the legacy
* systems requiring this for regular requests like text/html. In the standard,
* the encoding of the plus character is only mentioned for
* application/x-www-form-urlencoded
* (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
* leave the plus character as is in queries. To be more flexible, we allow the
* plus character on the query, but it can also be manually encoded by the user.
*
* Resources:
* - https://url.spec.whatwg.org/#urlencoded-parsing
* - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
*/
var ENC_BRACKET_OPEN_RE = /%5B/g;
var ENC_BRACKET_CLOSE_RE = /%5D/g;
var ENC_CARET_RE = /%5E/g;
var ENC_BACKTICK_RE = /%60/g;
var ENC_CURLY_OPEN_RE = /%7B/g;
var ENC_PIPE_RE = /%7C/g;
var ENC_CURLY_CLOSE_RE = /%7D/g;
var ENC_SPACE_RE = /%20/g;
/**
* Encode characters that need to be encoded on the path, search and hash
* sections of the URL.
*
* @internal
* @param text - string to encode
* @returns encoded string
*/
function commonEncode(text) {
	return text == null ? "" : encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
/**
* Encode characters that need to be encoded on the hash section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeHash(text) {
	return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Encode characters that need to be encoded query values on the query
* section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeQueryValue(text) {
	return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
/**
* Like `encodeQueryValue` but also encodes the `=` character.
*
* @param text - string to encode
*/
function encodeQueryKey(text) {
	return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
/**
* Encode characters that need to be encoded on the path section of the URL.
*
* @param text - string to encode
* @returns encoded string
*/
function encodePath(text) {
	return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
/**
* Encode characters that need to be encoded on the path section of the URL as a
* param. This function encodes everything {@link encodePath} does plus the
* slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
* string instead.
*
* @param text - string to encode
* @returns encoded string
*/
function encodeParam(text) {
	return encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
	if (text == null) return null;
	try {
		return decodeURIComponent("" + text);
	} catch {}
	return "" + text;
}
var TRAILING_SLASH_RE = /\/$/;
var removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
/**
* Transforms a URI into a normalized history location
*
* @param parseQuery
* @param location - URI to normalize
* @param currentLocation - current absolute location. Allows resolving relative
* paths. Must start with `/`. Defaults to `/`
* @returns a normalized history location
*/
function parseURL(parseQuery, location, currentLocation = "/") {
	let path, query = {}, searchString = "", hash = "";
	const hashPos = location.indexOf("#");
	let searchPos = location.indexOf("?");
	searchPos = hashPos >= 0 && searchPos > hashPos ? -1 : searchPos;
	if (searchPos >= 0) {
		path = location.slice(0, searchPos);
		searchString = location.slice(searchPos, hashPos > 0 ? hashPos : location.length);
		query = parseQuery(searchString.slice(1));
	}
	if (hashPos >= 0) {
		path = path || location.slice(0, hashPos);
		hash = location.slice(hashPos, location.length);
	}
	path = resolveRelativePath(path != null ? path : location, currentLocation);
	return {
		fullPath: path + searchString + hash,
		path,
		query,
		hash: decode(hash)
	};
}
/**
* Stringifies a URL object
*
* @param stringifyQuery
* @param location
*/
function stringifyURL(stringifyQuery, location) {
	const query = location.query ? stringifyQuery(location.query) : "";
	return location.path + (query && "?") + query + (location.hash || "");
}
/**
* Checks if two RouteLocation are equal. This means that both locations are
* pointing towards the same {@link RouteRecord} and that all `params`, `query`
* parameters and `hash` are the same
*
* @param stringifyQuery - A function that takes a query object of type LocationQueryRaw and returns a string representation of it.
* @param a - first {@link RouteLocation}
* @param b - second {@link RouteLocation}
*/
function isSameRouteLocation(stringifyQuery, a, b) {
	const aLastIndex = a.matched.length - 1;
	const bLastIndex = b.matched.length - 1;
	return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord$1(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams$1(a.params, b.params) && stringifyQuery(a.query) === stringifyQuery(b.query) && a.hash === b.hash;
}
/**
* Check if two `RouteRecords` are equal. Takes into account aliases: they are
* considered equal to the `RouteRecord` they are aliasing.
*
* @param a - first {@link RouteRecord}
* @param b - second {@link RouteRecord}
*/
function isSameRouteRecord$1(a, b) {
	return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams$1(a, b) {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (var key in a) if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
	return true;
}
function isSameRouteLocationParamsValue(a, b) {
	return isArray$1(a) ? isEquivalentArray$1(a, b) : isArray$1(b) ? isEquivalentArray$1(b, a) : (a && a.valueOf()) === (b && b.valueOf());
}
/**
* Check if two arrays are the same or if an array with one single entry is the
* same as another primitive value. Used to check query and parameters
*
* @param a - array of values
* @param b - array of values or a single value
*/
function isEquivalentArray$1(a, b) {
	return isArray$1(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
/**
* Resolves a relative path that starts with `.`.
*
* @param to - path location we are resolving
* @param from - currentLocation.path, should start with `/`
*/
function resolveRelativePath(to, from) {
	if (isAbsolutePath(to)) return to;
	if (!to) return from;
	const fromSegments = from.split("/");
	const toSegments = to.split("/");
	const lastToSegment = toSegments[toSegments.length - 1];
	if (lastToSegment === ".." || lastToSegment === ".") toSegments.push("");
	let position = fromSegments.length - 1;
	let toPosition;
	let segment;
	for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
		segment = toSegments[toPosition];
		if (segment === ".") continue;
		if (segment === "..") {
			if (position > 1) position--;
		} else break;
	}
	return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition).join("/");
}
/**
* Initial route location where the router is. Can be used in navigation guards
* to differentiate the initial navigation.
*
* @example
* ```js
* import { START_LOCATION } from 'vue-router'
*
* router.beforeEach((to, from) => {
*   if (from === START_LOCATION) {
*     // initial navigation
*   }
* })
* ```
*/
var START_LOCATION_NORMALIZED = {
	path: "/",
	name: void 0,
	params: {},
	query: {},
	hash: "",
	fullPath: "/",
	matched: [],
	meta: {},
	redirectedFrom: void 0
};
/**
* Normalizes a base by removing any trailing slash and reading the base tag if
* present.
*
* @param base - base to normalize
*/
function normalizeBase(base) {
	if (!base) base = "/";
	if (base[0] !== "/" && base[0] !== "#") base = "/" + base;
	return removeTrailingSlash(base);
}
var BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location) {
	return base.replace(BEFORE_HASH_RE, "#") + location;
}
/**
* ScrollBehavior instance used by the router to compute and restore the scroll
* position when navigating.
*/
function isRouteLocation(route) {
	return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
	return typeof name === "string" || typeof name === "symbol";
}
/**
* Transforms a queryString into a {@link LocationQuery} object. Accept both, a
* version with the leading `?` and without Should work as URLSearchParams

* @internal
*
* @param search - search string to parse
* @returns a query object
*/
function parseQuery(search) {
	const query = {};
	if (search === "" || search === "?") return query;
	const searchParams = (search[0] === "?" ? search.slice(1) : search).split("&");
	for (let i = 0; i < searchParams.length; ++i) {
		const searchParam = searchParams[i].replace(PLUS_RE, " ");
		const eqPos = searchParam.indexOf("=");
		const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
		const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
		if (key in query) {
			let currentValue = query[key];
			if (!isArray$1(currentValue)) currentValue = query[key] = [currentValue];
			currentValue.push(value);
		} else query[key] = value;
	}
	return query;
}
/**
* Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
* doesn't prepend a `?`
*
* @internal
*
* @param query - query object to stringify
* @returns string version of the query without the leading `?`
*/
function stringifyQuery(query) {
	let search = "";
	for (let key in query) {
		const value = query[key];
		key = encodeQueryKey(key);
		if (value == null) {
			if (value !== void 0) search += (search.length ? "&" : "") + key;
			continue;
		}
		(isArray$1(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)]).forEach((value) => {
			if (value !== void 0) {
				search += (search.length ? "&" : "") + key;
				if (value != null) search += "=" + value;
			}
		});
	}
	return search;
}
/**
* Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
* numbers into strings, removing keys with an undefined value and replacing
* undefined with null in arrays
*
* @param query - query object to normalize
* @returns a normalized query object
*/
function normalizeQuery(query) {
	const normalizedQuery = {};
	for (const key in query) {
		const value = query[key];
		if (value !== void 0) normalizedQuery[key] = isArray$1(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
	}
	return normalizedQuery;
}
/**
* Create a list of callbacks that can be reset. Used to create before and after navigation guards list
*/
function useCallbacks() {
	let handlers = [];
	function add(handler) {
		handlers.push(handler);
		return () => {
			const i = handlers.indexOf(handler);
			if (i > -1) handlers.splice(i, 1);
		};
	}
	function reset() {
		handlers = [];
	}
	return {
		add,
		list: () => handlers.slice(),
		reset
	};
}
function guardToPromiseFn(guard, to, from, record, name, runWithContext = (fn) => fn()) {
	const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
	return () => new Promise((resolve, reject) => {
		const next = (valid) => {
			if (valid === false) reject(createRouterError(4, {
				from,
				to
			}));
			else if (valid instanceof Error) reject(valid);
			else if (isRouteLocation(valid)) reject(createRouterError(2, {
				from: to,
				to: valid
			}));
			else {
				if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") enterCallbackArray.push(valid);
				resolve();
			}
		};
		const guardReturn = runWithContext(() => guard.call(record && record.instances[name], to, from, next));
		let guardCall = Promise.resolve(guardReturn);
		if (guard.length < 3) guardCall = guardCall.then(next);
		guardCall.catch((err) => reject(err));
	});
}
function extractComponentsGuards(matched, guardType, to, from, runWithContext = (fn) => fn()) {
	const guards = [];
	for (const record of matched) for (const name in record.components) {
		let rawComponent = record.components[name];
		if (guardType !== "beforeRouteEnter" && !record.instances[name]) continue;
		if (isRouteComponent(rawComponent)) {
			const guard = (rawComponent.__vccOpts || rawComponent)[guardType];
			guard && guards.push(guardToPromiseFn(guard, to, from, record, name, runWithContext));
		} else {
			let componentPromise = rawComponent();
			guards.push(() => componentPromise.then((resolved) => {
				if (!resolved) throw new Error(`Couldn't resolve component "${name}" at "${record.path}"`);
				const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
				record.mods[name] = resolved;
				record.components[name] = resolvedComponent;
				const guard = (resolvedComponent.__vccOpts || resolvedComponent)[guardType];
				return guard && guardToPromiseFn(guard, to, from, record, name, runWithContext)();
			}));
		}
	}
	return guards;
}
/**
* Split the leaving, updating, and entering records.
* @internal
*
* @param  to - Location we are navigating to
* @param from - Location we are navigating from
*/
function extractChangingRecords(to, from) {
	const leavingRecords = [];
	const updatingRecords = [];
	const enteringRecords = [];
	const len = Math.max(from.matched.length, to.matched.length);
	for (let i = 0; i < len; i++) {
		const recordFrom = from.matched[i];
		if (recordFrom) {
			if (to.matched.find((record) => isSameRouteRecord$1(record, recordFrom))) updatingRecords.push(recordFrom);
			else leavingRecords.push(recordFrom);
		}
		const recordTo = to.matched[i];
		if (recordTo) {
			if (!from.matched.find((record) => isSameRouteRecord$1(record, recordTo))) enteringRecords.push(recordTo);
		}
	}
	return [
		leavingRecords,
		updatingRecords,
		enteringRecords
	];
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/utils.js
/**
* Internal utility
* @private
*/
var _wrapInTransition = (props, children) => {
	return { default: () => children.default?.() };
};
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
function generateRouteKey$1(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION_NORMALIZED) return false;
	if (generateRouteKey$1(to) !== generateRouteKey$1(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
var VALID_TAG_RE = /^[a-z][a-z0-9-]*$/i;
/** Return `tag` if it is a safe HTML tag name, otherwise `fallback`. */
function sanitizeTag(tag, fallback) {
	return tag && VALID_TAG_RE.test(tag) ? tag : fallback;
}
function toArray$2(value) {
	return Array.isArray(value) ? value : [value];
}
/**
* Internal utility
* @private
*/
function _mergeTransitionProps(routeProps) {
	const _props = [];
	for (const prop of routeProps) {
		if (!prop) continue;
		_props.push({
			...prop,
			onAfterLeave: prop.onAfterLeave ? toArray$2(prop.onAfterLeave) : void 0,
			onBeforeLeave: prop.onBeforeLeave ? toArray$2(prop.onBeforeLeave) : void 0
		});
	}
	return defu(..._props);
}
function _startTransition(nuxtApp) {
	nuxtApp["~transitionPromise"] ||= new Promise((resolve) => {
		nuxtApp["~transitionFinish"] = resolve;
	});
}
function _finishTransition(nuxtApp) {
	nuxtApp["~transitionFinish"]?.();
	delete nuxtApp["~transitionFinish"];
	delete nuxtApp["~transitionPromise"];
}

//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION_NORMALIZED) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(selector) {
	try {
		const elem = (void 0).querySelector(selector);
		if (elem) return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
	} catch {}
	return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	sensitive: false,
	...router_options_default
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-link.js
var firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtLink(options) {
	const componentName = options.componentName || "NuxtLink";
	function isHashLinkWithoutHashMode(link) {
		return typeof link === "string" && link.startsWith("#");
	}
	function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
		const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
		if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") return to;
		if (typeof to === "string") return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
		const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
		return {
			...to,
			name: void 0,
			path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
		};
	}
	/**
	* The link state `<NuxtLink>` renders with. Kept separate from `useNuxtLink` so the component
	* does not resolve the `<RouterLink>` link state backing `route`/`isActive`/`isExactActive`,
	* which it never reads.
	*/
	function useLinkTarget(props) {
		const router = useRouter();
		const config = /* @__PURE__ */ useRuntimeConfig();
		const rootedHref = router.options?.history?.createHref ?? ((path) => joinURL(config.app.baseURL, path));
		const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
		const isAbsoluteUrl = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			return typeof path === "string" && isAbsoluteHref(path);
		});
		const isExternal = computed(() => {
			if (unref(props.external)) return true;
			const path = unref(props.to) || unref(props.href) || "";
			if (typeof path === "object") return false;
			return path === "" || isAbsoluteUrl.value;
		});
		const to = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			if (isExternal.value) return path;
			return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
		});
		const href = computed(() => {
			const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
			if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
				const raw = to.value;
				return typeof raw === "string" ? sanitizeAnchorHref(raw) : raw;
			}
			if (isExternal.value) {
				const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
				const href = typeof path === "object" ? router.resolve(path).href : path;
				const safe = typeof href === "string" ? sanitizeAnchorHref(href) : href;
				return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
			}
			if (typeof to.value === "object") return router.resolve(to.value)?.href ?? null;
			return applyTrailingSlashBehavior(isRootedPath(to.value) ? rootedHref(to.value) : router.resolve(to.value).href, effectiveTrailingSlash);
		});
		return {
			to,
			hasTarget,
			isAbsoluteUrl,
			isExternal,
			href,
			async navigate(_e) {
				if (href.value === null) return;
				await navigateTo(href.value, {
					replace: unref(props.replace),
					external: isExternal.value || hasTarget.value
				});
			}
		};
	}
	function useNuxtLink(props) {
		const router = useRouter();
		const target = useLinkTarget(props);
		const builtinRouterLink = resolveComponent("RouterLink");
		const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
		const link = target.isExternal.value ? void 0 : useBuiltinLink?.({
			...props,
			to: target.to,
			viewTransition: unref(props.viewTransition)
		});
		return {
			...target,
			isActive: link?.isActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			isExactActive: link?.isExactActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			route: link?.route ?? computed(() => router.resolve(target.to.value))
		};
	}
	/**
	* Render an internal link as a plain anchor, matching the markup `<RouterLink>` produces
	* for the same location.
	*/
	function renderStaticInternalLink(props, slots, router, rawTo) {
		const route = router.resolve(resolveTrailingSlashBehavior(rawTo, router.resolve, props.trailingSlash));
		const currentRoute = router.currentRoute.value;
		const index = activeRecordIndex(route, currentRoute);
		const isActive = index > -1 && includesParams$1(currentRoute.params, route.params);
		const isExactActive = index > -1 && index === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.params);
		let dataInternal;
		const routerOptions = router.options;
		const href = sanitizeAnchorHref(route.href);
		return h("a", {
			"aria-current": isExactActive ? props.ariaCurrentValue ?? "page" : null,
			href,
			"class": {
				[getLinkClass$1(props.activeClass || options.activeClass, routerOptions.linkActiveClass, "router-link-active")]: isActive,
				[getLinkClass$1(props.exactActiveClass || options.exactActiveClass, routerOptions.linkExactActiveClass, "router-link-exact-active")]: isExactActive
			},
			"rel": props.rel || void 0,
			"data-internal": dataInternal
		}, slots.default?.({
			route,
			href,
			isActive,
			isExactActive,
			navigate: () => navigateTo(route.href, { replace: props.replace })
		}));
	}
	return defineComponent({
		name: componentName,
		props: {
			to: {
				type: [String, Object],
				required: false
			},
			href: {
				type: [String, Object],
				required: false
			},
			target: {
				type: String,
				required: false
			},
			rel: {
				type: String,
				required: false
			},
			noRel: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetchOn: {
				type: [String, Object],
				required: false
			},
			noPrefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			activeClass: {
				type: String,
				required: false
			},
			exactActiveClass: {
				type: String,
				required: false
			},
			prefetchedClass: {
				type: String,
				required: false
			},
			replace: {
				type: Boolean,
				default: void 0,
				required: false
			},
			ariaCurrentValue: {
				type: String,
				required: false
			},
			external: {
				type: Boolean,
				default: void 0,
				required: false
			},
			custom: {
				type: Boolean,
				default: void 0,
				required: false
			},
			trailingSlash: {
				type: String,
				required: false
			}
		},
		useLink: useNuxtLink,
		setup(props, { slots }) {
			const router = useRouter();
			if (!props.custom) {
				const rawTo = props.to || props.href || "";
				if (!(props.external || typeof rawTo === "string" && (rawTo === "" || isAbsoluteHref(rawTo))) && !isHashLinkWithoutHashMode(rawTo) && (!props.target || props.target === "_self")) return () => renderStaticInternalLink(props, slots, router, rawTo);
			}
			const routerLinkComponent = resolveComponent("RouterLink");
			const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useLinkTarget(props);
			const prefetched = shallowRef(false);
			const el = void 0;
			const elRef = void 0;
			function shouldPrefetch(mode) {
				return false;
			}
			async function prefetch(nuxtApp = useNuxtApp()) {}
			return () => {
				const target = props.target || null;
				const rel = firstNonUndefined(props.noRel ? "" : props.rel, options.externalRelAttribute, isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : "") || null;
				const getCustomSlotProps = (routerLinkSlotProps) => ({
					navigate,
					get route() {
						if (!href.value) return;
						const url = new URL(href.value, "http://localhost");
						return {
							path: url.pathname,
							fullPath: url.pathname,
							get query() {
								return parseQuery$1(url.search);
							},
							hash: url.hash,
							params: {},
							name: void 0,
							matched: [],
							redirectedFrom: void 0,
							meta: {},
							href: href.value
						};
					},
					rel,
					target,
					isExternal: isExternal.value || hasTarget.value,
					isActive: false,
					isExactActive: false,
					...routerLinkSlotProps,
					href: typeof routerLinkSlotProps?.href === "string" ? sanitizeAnchorHref(routerLinkSlotProps.href) : href.value,
					prefetch,
					prefetched: prefetched.value,
					shouldPrefetch
				});
				if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
					const routerLinkProps = {
						ref: elRef,
						to: to.value,
						activeClass: props.activeClass || options.activeClass,
						exactActiveClass: props.exactActiveClass || options.exactActiveClass,
						replace: props.replace,
						ariaCurrentValue: props.ariaCurrentValue,
						custom: props.custom
					};
					if (!props.custom) routerLinkProps.rel = props.rel || void 0;
					return h(routerLinkComponent, routerLinkProps, props.custom && slots.default ? { default: (slotProps) => slots.default(getCustomSlotProps(slotProps)) } : slots.default);
				}
				if (props.custom) {
					if (!slots.default) return null;
					return slots.default(getCustomSlotProps());
				}
				return h("a", {
					ref: el,
					href: href.value || null,
					rel,
					target,
					onClick: async (event) => {
						if (isExternal.value || hasTarget.value) return;
						event.preventDefault();
						try {
							const encodedHref = encodeRoutePath(href.value ?? "");
							return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
						} finally {}
					}
				}, slots.default?.());
			};
		}
	});
}
var NuxtLink = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function isSameRouteRecord(a, b) {
	return (a.aliasOf || a) === (b.aliasOf || b);
}
function getOriginalPath$1(record) {
	return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isEquivalentArray(a, b) {
	return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function isSameParamValue(a, b) {
	return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : (a && a.valueOf()) === (b && b.valueOf());
}
function isSameRouteLocationParams(a, b) {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (!isSameParamValue(a[key], b[key])) return false;
	return true;
}
function includesParams$1(outer, inner) {
	for (const key in inner) {
		const innerValue = inner[key];
		const outerValue = outer[key];
		if (typeof innerValue === "string") {
			if (innerValue !== outerValue) return false;
		} else if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value.valueOf() !== outerValue[i].valueOf())) return false;
	}
	return true;
}
function activeRecordIndex(route, currentRoute) {
	const { matched } = route;
	const { length } = matched;
	const routeMatched = matched[length - 1];
	const currentMatched = currentRoute.matched;
	if (!routeMatched || !currentMatched.length) return -1;
	const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
	if (index > -1) return index;
	const parentRecordPath = getOriginalPath$1(matched[length - 2]);
	return length > 1 && getOriginalPath$1(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
}
/** Resolve an active-link class, falling back from the per-link value to the router-wide one. */
function getLinkClass$1(propClass, globalClass, defaultClass) {
	return propClass ?? globalClass ?? defaultClass;
}
function applyTrailingSlashBehavior(to, trailingSlash) {
	if (trailingSlash !== "append" && trailingSlash !== "remove") return to;
	const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
	if (hasProtocol(to) && !to.startsWith("http")) return to;
	return normalizeFn(to, true);
}

//#region node_modules/.pnpm/klona@2.0.6/node_modules/klona/dist/index.mjs
function klona(x) {
	if (typeof x !== "object") return x;
	var k, tmp, str = Object.prototype.toString.call(x);
	if (str === "[object Object]") {
		if (x.constructor !== Object && typeof x.constructor === "function") {
			tmp = new x.constructor();
			for (k in x) if (x.hasOwnProperty(k) && tmp[k] !== x[k]) tmp[k] = klona(x[k]);
		} else {
			tmp = {};
			for (k in x) if (k === "__proto__") Object.defineProperty(tmp, k, {
				value: klona(x[k]),
				configurable: true,
				enumerable: true,
				writable: true
			});
			else tmp[k] = klona(x[k]);
		}
		return tmp;
	}
	if (str === "[object Array]") {
		k = x.length;
		for (tmp = Array(k); k--;) tmp[k] = klona(x[k]);
		return tmp;
	}
	if (str === "[object Set]") {
		tmp = /* @__PURE__ */ new Set();
		x.forEach(function(val) {
			tmp.add(klona(val));
		});
		return tmp;
	}
	if (str === "[object Map]") {
		tmp = /* @__PURE__ */ new Map();
		x.forEach(function(val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}
	if (str === "[object Date]") return /* @__PURE__ */ new Date(+x);
	if (str === "[object RegExp]") {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}
	if (str === "[object DataView]") return new x.constructor(klona(x.buffer));
	if (str === "[object ArrayBuffer]") return x.slice(0);
	if (str.slice(-6) === "Array]") return new x.constructor(x);
	return x;
}
//#endregion
//#region node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/_chunks/is-equal.mjs
function serialize(input) {
	if (typeof input === "string") return `'${input}'`;
	return new Serializer().serialize(input);
}
var asciiOrder = " _-,;:!?.'\"()[]{}@*/\\&#%`^+<=>|~$0123456789abcdefghijklmnopqrstuvwxyz";
var asciiWeights = /*@__PURE__*/ (function() {
	const weights = /* @__PURE__ */ new Uint8Array(128);
	for (let i = 0; i < 69; i++) weights[asciiOrder.charCodeAt(i)] = i + 1;
	for (let code = 65; code <= 90; code++) weights[code] = weights[code + 32];
	return weights;
})();
function compareStrings(a, b) {
	if (a === b) return 0;
	const length = Math.min(a.length, b.length);
	let tieBreaker = 0;
	for (let i = 0; i < length; i++) {
		const codeA = a.charCodeAt(i);
		const codeB = b.charCodeAt(i);
		if (codeA === codeB) continue;
		const weightA = codeA < 128 && asciiWeights[codeA] ? asciiWeights[codeA] : codeA + 128;
		const weightB = codeB < 128 && asciiWeights[codeB] ? asciiWeights[codeB] : codeB + 128;
		if (weightA !== weightB) return weightA < weightB ? -1 : 1;
		if (tieBreaker === 0) tieBreaker = codeA > codeB ? -1 : 1;
	}
	if (a.length !== b.length) return a.length < b.length ? -1 : 1;
	return tieBreaker;
}
var Serializer = /*@__PURE__*/ (function() {
	class Serializer {
		#context = /* @__PURE__ */ new Map();
		compare(a, b) {
			const typeA = typeof a;
			const typeB = typeof b;
			if (typeA === "string" && typeB === "string") return compareStrings(a, b);
			if (typeA === "number" && typeB === "number") return a - b;
			return compareStrings(this.serialize(a, true), this.serialize(b, true));
		}
		serialize(value, noQuotes) {
			if (value === null) return "null";
			switch (typeof value) {
				case "string": return noQuotes ? value : `'${value}'`;
				case "bigint": return `${value}n`;
				case "object": return this.$object(value);
				case "function": return this.$function(value);
			}
			return String(value);
		}
		serializeObject(object) {
			const objString = Object.prototype.toString.call(object);
			if (objString !== "[object Object]") return this.serializeBuiltInType(objString.length < 10 ? `unknown:${objString}` : objString.slice(8, -1), object);
			const constructor = object.constructor;
			const objName = constructor === Object || constructor === void 0 ? "" : constructor.name;
			if (objName !== "" && globalThis[objName] === constructor) return this.serializeBuiltInType(objName, object);
			if ("toJSON" in object && typeof object.toJSON === "function") {
				const json = object.toJSON();
				return objName + (json !== null && typeof json === "object" ? this.$object(json) : `(${this.serialize(json)})`);
			}
			const keys = Object.keys(object).sort(compareStrings);
			let content = `${objName}{`;
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				content += `${key}:${this.serialize(object[key])}`;
				if (i < keys.length - 1) content += ",";
			}
			return content + "}";
		}
		serializeBuiltInType(type, object) {
			const handler = this["$" + type];
			if (handler) return handler.call(this, object);
			if (typeof object.entries === "function") return this.serializeObjectEntries(type, object.entries());
			throw new Error(`Cannot serialize ${type}`);
		}
		serializeObjectEntries(type, entries) {
			const sortedEntries = Array.from(entries).sort((a, b) => this.compare(a[0], b[0]));
			let content = `${type}{`;
			for (let i = 0; i < sortedEntries.length; i++) {
				const [key, value] = sortedEntries[i];
				content += `${this.serialize(key, true)}:${this.serialize(value)}`;
				if (i < sortedEntries.length - 1) content += ",";
			}
			return content + "}";
		}
		$object(object) {
			let content = this.#context.get(object);
			if (content === void 0) {
				this.#context.set(object, `#${this.#context.size}`);
				content = this.serializeObject(object);
				this.#context.set(object, content);
			}
			return content;
		}
		$function(fn) {
			const fnStr = Function.prototype.toString.call(fn);
			if (fnStr.slice(-15) === "[native code] }") return `${fn.name || ""}()[native]`;
			return `${fn.name}(${fn.length})${fnStr.replace(/\s*\n\s*/g, "")}`;
		}
		$Array(arr) {
			let content = "[";
			for (let i = 0; i < arr.length; i++) {
				content += this.serialize(arr[i]);
				if (i < arr.length - 1) content += ",";
			}
			return content + "]";
		}
		$Date(date) {
			try {
				return `Date(${date.toISOString()})`;
			} catch {
				return `Date(null)`;
			}
		}
		$ArrayBuffer(arr) {
			return `ArrayBuffer[${new Uint8Array(arr).join(",")}]`;
		}
		$Set(set) {
			return `Set${this.$Array(Array.from(set).sort((a, b) => this.compare(a, b)))}`;
		}
		$Map(map) {
			return this.serializeObjectEntries("Map", map.entries());
		}
	}
	for (const type of [
		"Error",
		"RegExp",
		"URL"
	]) Serializer.prototype["$" + type] = function(val) {
		return `${type}(${val})`;
	};
	for (const type of [
		"Int8Array",
		"Uint8Array",
		"Uint8ClampedArray",
		"Int16Array",
		"Uint16Array",
		"Int32Array",
		"Uint32Array",
		"Float32Array",
		"Float64Array"
	]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join(",")}]`;
	};
	for (const type of ["BigInt64Array", "BigUint64Array"]) Serializer.prototype["$" + type] = function(arr) {
		return `${type}[${arr.join("n,")}${arr.length > 0 ? "n" : ""}]`;
	};
	return Serializer;
})();
function isEqual$1(object1, object2) {
	if (object1 === object2) return true;
	if (serialize(object1) === serialize(object2)) return true;
	return false;
}
//#endregion
//#region node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/crypto/node/index.mjs
var fastHash = /*@__PURE__*/ (() => globalThis.process?.getBuiltinModule?.("crypto")?.hash)();
var algorithm = "sha256";
var encoding = "base64url";
function digest(data) {
	if (fastHash) return fastHash(algorithm, data, encoding);
	const h = createHash(algorithm).update(data);
	return globalThis.process?.versions?.webcontainer ? h.digest().toString(encoding) : h.digest(encoding);
}
//#endregion
//#region node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/index.mjs
function hash(input) {
	return digest(serialize(input));
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fapp.config.mjs
var inlineConfig = {
	"nuxt": {},
	"ui": {
		"colors": {
			"primary": "green",
			"secondary": "blue",
			"success": "green",
			"info": "blue",
			"warning": "yellow",
			"error": "red",
			"neutral": "slate"
		},
		"icons": {
			"arrowDown": "i-lucide-arrow-down",
			"arrowLeft": "i-lucide-arrow-left",
			"arrowRight": "i-lucide-arrow-right",
			"arrowUp": "i-lucide-arrow-up",
			"caution": "i-lucide-circle-alert",
			"check": "i-lucide-check",
			"chevronDoubleLeft": "i-lucide-chevrons-left",
			"chevronDoubleRight": "i-lucide-chevrons-right",
			"chevronDown": "i-lucide-chevron-down",
			"chevronLeft": "i-lucide-chevron-left",
			"chevronRight": "i-lucide-chevron-right",
			"chevronUp": "i-lucide-chevron-up",
			"close": "i-lucide-x",
			"copy": "i-lucide-copy",
			"copyCheck": "i-lucide-copy-check",
			"dark": "i-lucide-moon",
			"drag": "i-lucide-grip-vertical",
			"ellipsis": "i-lucide-ellipsis",
			"error": "i-lucide-circle-x",
			"external": "i-lucide-arrow-up-right",
			"eye": "i-lucide-eye",
			"eyeOff": "i-lucide-eye-off",
			"file": "i-lucide-file",
			"folder": "i-lucide-folder",
			"folderOpen": "i-lucide-folder-open",
			"hash": "i-lucide-hash",
			"info": "i-lucide-info",
			"light": "i-lucide-sun",
			"loading": "i-lucide-loader-circle",
			"menu": "i-lucide-menu",
			"minus": "i-lucide-minus",
			"panelClose": "i-lucide-panel-left-close",
			"panelOpen": "i-lucide-panel-left-open",
			"plus": "i-lucide-plus",
			"reload": "i-lucide-rotate-ccw",
			"search": "i-lucide-search",
			"stop": "i-lucide-square",
			"star": "i-lucide-star",
			"success": "i-lucide-circle-check",
			"system": "i-lucide-monitor",
			"tip": "i-lucide-lightbulb",
			"upload": "i-lucide-upload",
			"warning": "i-lucide-triangle-alert"
		},
		"tv": { "twMergeConfig": {} }
	},
	"icon": {
		"provider": "server",
		"class": "",
		"aliases": {},
		"iconifyApiEndpoint": "https://api.iconify.design",
		"localApiEndpoint": "/api/_nuxt_icon",
		"fallbackToApi": true,
		"cssSelectorPrefix": "i-",
		"cssWherePseudo": true,
		"cssLayer": "base",
		"mode": "css",
		"attrs": { "aria-hidden": true },
		"collections": [
			"academicons",
			"akar-icons",
			"ant-design",
			"arcticons",
			"basil",
			"bi",
			"bitcoin-icons",
			"bpmn",
			"brandico",
			"bx",
			"bxl",
			"bxs",
			"bytesize",
			"carbon",
			"catppuccin",
			"cbi",
			"charm",
			"ci",
			"cib",
			"cif",
			"cil",
			"circle-flags",
			"circum",
			"clarity",
			"codex",
			"codicon",
			"covid",
			"cryptocurrency",
			"cryptocurrency-color",
			"cuida",
			"dashicons",
			"devicon",
			"devicon-plain",
			"dinkie-icons",
			"duo-icons",
			"ei",
			"el",
			"emojione",
			"emojione-monotone",
			"emojione-v1",
			"entypo",
			"entypo-social",
			"eos-icons",
			"ep",
			"et",
			"eva",
			"f7",
			"fa",
			"fa-brands",
			"fa-regular",
			"fa-solid",
			"fa6-brands",
			"fa6-regular",
			"fa6-solid",
			"fa7-brands",
			"fa7-regular",
			"fa7-solid",
			"fad",
			"famicons",
			"fe",
			"feather",
			"file-icons",
			"flag",
			"flagpack",
			"flat-color-icons",
			"flat-ui",
			"flowbite",
			"fluent",
			"fluent-color",
			"fluent-emoji",
			"fluent-emoji-flat",
			"fluent-emoji-high-contrast",
			"fluent-mdl2",
			"fontelico",
			"fontisto",
			"formkit",
			"foundation",
			"fxemoji",
			"gala",
			"game-icons",
			"garden",
			"geo",
			"gg",
			"gis",
			"gravity-ui",
			"gridicons",
			"grommet-icons",
			"guidance",
			"healthicons",
			"heroicons",
			"heroicons-outline",
			"heroicons-solid",
			"hugeicons",
			"humbleicons",
			"ic",
			"icomoon-free",
			"icon-park",
			"icon-park-outline",
			"icon-park-solid",
			"icon-park-twotone",
			"iconamoon",
			"iconoir",
			"icons8",
			"il",
			"ion",
			"iwwa",
			"ix",
			"jam",
			"la",
			"lets-icons",
			"line-md",
			"lineicons",
			"logos",
			"ls",
			"lsicon",
			"lucide",
			"lucide-lab",
			"mage",
			"majesticons",
			"maki",
			"map",
			"marketeq",
			"material-icon-theme",
			"material-symbols",
			"material-symbols-light",
			"mdi",
			"mdi-light",
			"medical-icon",
			"memory",
			"meteocons",
			"meteor-icons",
			"mi",
			"mingcute",
			"mono-icons",
			"mynaui",
			"nimbus",
			"nonicons",
			"noto",
			"noto-v1",
			"nrk",
			"octicon",
			"oi",
			"ooui",
			"openmoji",
			"oui",
			"pajamas",
			"pepicons",
			"pepicons-pencil",
			"pepicons-pop",
			"pepicons-print",
			"ph",
			"picon",
			"pixel",
			"pixelarticons",
			"prime",
			"proicons",
			"ps",
			"qlementine-icons",
			"quill",
			"radix-icons",
			"raphael",
			"ri",
			"rivet-icons",
			"roentgen",
			"si",
			"si-glyph",
			"sidekickicons",
			"simple-icons",
			"simple-line-icons",
			"skill-icons",
			"solar",
			"stash",
			"streamline",
			"streamline-block",
			"streamline-color",
			"streamline-cyber",
			"streamline-cyber-color",
			"streamline-emojis",
			"streamline-flex",
			"streamline-flex-color",
			"streamline-freehand",
			"streamline-freehand-color",
			"streamline-kameleon-color",
			"streamline-logos",
			"streamline-pixel",
			"streamline-plump",
			"streamline-plump-color",
			"streamline-sharp",
			"streamline-sharp-color",
			"streamline-stickies-color",
			"streamline-ultimate",
			"streamline-ultimate-color",
			"subway",
			"svg-spinners",
			"system-uicons",
			"tabler",
			"tdesign",
			"teenyicons",
			"temaki",
			"token",
			"token-branded",
			"topcoat",
			"twemoji",
			"typcn",
			"uil",
			"uim",
			"uis",
			"uit",
			"uiw",
			"unjs",
			"vaadin",
			"vs",
			"vscode-icons",
			"websymbol",
			"weui",
			"whh",
			"wi",
			"wpf",
			"zmdi",
			"zondicons"
		],
		"fetchTimeout": 1500
	}
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/config.js
function useAppConfig() {
	const nuxtApp = useNuxtApp();
	nuxtApp._appConfig ||= klona(inlineConfig);
	return nuxtApp._appConfig;
}
//#endregion
//#region node_modules/.pnpm/@iconify+vue@5.0.3_vue@3.5.44_typescript@5.9.3_/node_modules/@iconify/vue/dist/iconify.mjs
/**
* Expression to test part of icon name.
*
* Used when loading icons from Iconify API due to project naming convension.
* Ignored when using custom icon sets - convension does not apply.
*/
var matchIconName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/**
* Convert string icon name to IconifyIconName object.
*/
var stringToIcon = (value, validate, allowSimpleName, provider = "") => {
	const colonSeparated = value.split(":");
	if (value.slice(0, 1) === "@") {
		if (colonSeparated.length < 2 || colonSeparated.length > 3) return null;
		provider = colonSeparated.shift().slice(1);
	}
	if (colonSeparated.length > 3 || !colonSeparated.length) return null;
	if (colonSeparated.length > 1) {
		const name = colonSeparated.pop();
		const prefix = colonSeparated.pop();
		const result = {
			provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
			prefix,
			name
		};
		return validate && !validateIconName(result) ? null : result;
	}
	const name = colonSeparated[0];
	const dashSeparated = name.split("-");
	if (dashSeparated.length > 1) {
		const result = {
			provider,
			prefix: dashSeparated.shift(),
			name: dashSeparated.join("-")
		};
		return validate && !validateIconName(result) ? null : result;
	}
	if (allowSimpleName && provider === "") {
		const result = {
			provider,
			prefix: "",
			name
		};
		return validate && !validateIconName(result, allowSimpleName) ? null : result;
	}
	return null;
};
/**
* Check if icon is valid.
*
* This function is not part of stringToIcon because validation is not needed for most code.
*/
var validateIconName = (icon, allowSimpleName) => {
	if (!icon) return false;
	return !!((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
};
/**
* Resolve icon set icons
*
* Returns parent icon for each icon
*/
function getIconsTree(data, names) {
	const icons = data.icons;
	const aliases = data.aliases || Object.create(null);
	const resolved = Object.create(null);
	function resolve(name) {
		if (icons[name]) return resolved[name] = [];
		if (!(name in resolved)) {
			resolved[name] = null;
			const parent = aliases[name] && aliases[name].parent;
			const value = parent && resolve(parent);
			if (value) resolved[name] = [parent].concat(value);
		}
		return resolved[name];
	}
	Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
	return resolved;
}
/** Default values for dimensions */
var defaultIconDimensions$1 = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16
});
/** Default values for transformations */
var defaultIconTransformations$1 = Object.freeze({
	rotate: 0,
	vFlip: false,
	hFlip: false
});
/** Default values for all optional IconifyIcon properties */
var defaultIconProps$1 = Object.freeze({
	...defaultIconDimensions$1,
	...defaultIconTransformations$1
});
/** Default values for all properties used in ExtendedIconifyIcon */
var defaultExtendedIconProps$1 = Object.freeze({
	...defaultIconProps$1,
	body: "",
	hidden: false
});
/**
* Merge transformations
*/
function mergeIconTransformations(obj1, obj2) {
	const result = {};
	if (!obj1.hFlip !== !obj2.hFlip) result.hFlip = true;
	if (!obj1.vFlip !== !obj2.vFlip) result.vFlip = true;
	const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
	if (rotate) result.rotate = rotate;
	return result;
}
/**
* Merge icon and alias
*
* Can also be used to merge default values and icon
*/
function mergeIconData(parent, child) {
	const result = mergeIconTransformations(parent, child);
	for (const key in defaultExtendedIconProps$1) if (key in defaultIconTransformations$1) {
		if (key in parent && !(key in result)) result[key] = defaultIconTransformations$1[key];
	} else if (key in child) result[key] = child[key];
	else if (key in parent) result[key] = parent[key];
	return result;
}
/**
* Get icon data, using prepared aliases tree
*/
function internalGetIconData(data, name, tree) {
	const icons = data.icons;
	const aliases = data.aliases || Object.create(null);
	let currentProps = {};
	function parse(name) {
		currentProps = mergeIconData(icons[name] || aliases[name], currentProps);
	}
	parse(name);
	tree.forEach(parse);
	return mergeIconData(data, currentProps);
}
/**
* Extract icons from an icon set
*
* Returns list of icons that were found in icon set
*/
function parseIconSet(data, callback) {
	const names = [];
	if (typeof data !== "object" || typeof data.icons !== "object") return names;
	if (data.not_found instanceof Array) data.not_found.forEach((name) => {
		callback(name, null);
		names.push(name);
	});
	const tree = getIconsTree(data);
	for (const name in tree) {
		const item = tree[name];
		if (item) {
			callback(name, internalGetIconData(data, name, item));
			names.push(name);
		}
	}
	return names;
}
/**
* Optional properties
*/
var optionalPropertyDefaults = {
	provider: "",
	aliases: {},
	not_found: {},
	...defaultIconDimensions$1
};
/**
* Check props
*/
function checkOptionalProps(item, defaults) {
	for (const prop in defaults) if (prop in item && typeof item[prop] !== typeof defaults[prop]) return false;
	return true;
}
/**
* Validate icon set, return it as IconifyJSON on success, null on failure
*
* Unlike validateIconSet(), this function is very basic.
* It does not throw exceptions, it does not check metadata, it does not fix stuff.
*/
function quicklyValidateIconSet(obj) {
	if (typeof obj !== "object" || obj === null) return null;
	const data = obj;
	if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") return null;
	if (!checkOptionalProps(obj, optionalPropertyDefaults)) return null;
	const icons = data.icons;
	for (const name in icons) {
		const icon = icons[name];
		if (!name || typeof icon.body !== "string" || !checkOptionalProps(icon, defaultExtendedIconProps$1)) return null;
	}
	const aliases = data.aliases || Object.create(null);
	for (const name in aliases) {
		const icon = aliases[name];
		const parent = icon.parent;
		if (!name || typeof parent !== "string" || !icons[parent] && !aliases[parent] || !checkOptionalProps(icon, defaultExtendedIconProps$1)) return null;
	}
	return data;
}
/**
* Storage by provider and prefix
*/
var dataStorage = Object.create(null);
/**
* Create new storage
*/
function newStorage(provider, prefix) {
	return {
		provider,
		prefix,
		icons: Object.create(null),
		missing: /* @__PURE__ */ new Set()
	};
}
/**
* Get storage for provider and prefix
*/
function getStorage(provider, prefix) {
	const providerStorage = dataStorage[provider] || (dataStorage[provider] = Object.create(null));
	return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
/**
* Add icon set to storage
*
* Returns array of added icons
*/
function addIconSet(storage, data) {
	if (!quicklyValidateIconSet(data)) return [];
	return parseIconSet(data, (name, icon) => {
		if (icon) storage.icons[name] = icon;
		else storage.missing.add(name);
	});
}
/**
* Allow storing icons without provider or prefix, making it possible to store icons like "home"
*/
var simpleNames = false;
function allowSimpleNames(allow) {
	if (typeof allow === "boolean") simpleNames = allow;
	return simpleNames;
}
/**
* Get icon data
*
* Returns:
* - IconifyIcon on success, object directly from storage so don't modify it
* - null if icon is marked as missing (returned in `not_found` property from API, so don't bother sending API requests)
* - undefined if icon is missing in storage
*/
function getIconData(name) {
	const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
	if (icon) {
		const storage = getStorage(icon.provider, icon.prefix);
		const iconName = icon.name;
		return storage.icons[iconName] || (storage.missing.has(iconName) ? null : void 0);
	}
}
/**
* Get full icon
*/
function getIcon(name) {
	const result = getIconData(name);
	return result ? {
		...defaultIconProps$1,
		...result
	} : result;
}
/**
* Default icon customisations values
*/
var defaultIconSizeCustomisations$1 = Object.freeze({
	width: null,
	height: null
});
var defaultIconCustomisations$1 = Object.freeze({
	...defaultIconSizeCustomisations$1,
	...defaultIconTransformations$1
});
/**
* Regular expressions for calculating dimensions
*/
var unitsSplit$1 = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
var unitsTest$1 = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize$1(size, ratio, precision) {
	if (ratio === 1) return size;
	precision = precision || 100;
	if (typeof size === "number") return Math.ceil(size * ratio * precision) / precision;
	if (typeof size !== "string") return size;
	const oldParts = size.split(unitsSplit$1);
	if (oldParts === null || !oldParts.length) return size;
	const newParts = [];
	let code = oldParts.shift();
	let isNumber = unitsTest$1.test(code);
	while (true) {
		if (isNumber) {
			const num = parseFloat(code);
			if (isNaN(num)) newParts.push(code);
			else newParts.push(Math.ceil(num * ratio * precision) / precision);
		} else newParts.push(code);
		code = oldParts.shift();
		if (code === void 0) return newParts.join("");
		isNumber = !isNumber;
	}
}
function splitSVGDefs$1(content, tag = "defs") {
	let defs = "";
	const index = content.indexOf("<" + tag);
	while (index >= 0) {
		const start = content.indexOf(">", index);
		const end = content.indexOf("</" + tag);
		if (start === -1 || end === -1) break;
		const endEnd = content.indexOf(">", end);
		if (endEnd === -1) break;
		defs += content.slice(start + 1, end).trim();
		content = content.slice(0, index).trim() + content.slice(endEnd + 1);
	}
	return {
		defs,
		content
	};
}
/**
* Merge defs and content
*/
function mergeDefsAndContent$1(defs, content) {
	return defs ? "<defs>" + defs + "</defs>" + content : content;
}
/**
* Wrap SVG content, without wrapping definitions
*/
function wrapSVGContent$1(body, start, end) {
	const split = splitSVGDefs$1(body);
	return mergeDefsAndContent$1(split.defs, start + split.content + end);
}
/**
* Check if value should be unset. Allows multiple keywords
*/
var isUnsetKeyword$1 = (value) => value === "unset" || value === "undefined" || value === "none";
/**
* Get SVG attributes and content from icon + customisations
*
* Does not generate style to make it compatible with frameworks that use objects for style, such as React.
* Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
*
* Customisations should be normalised by platform specific parser.
* Result should be converted to <svg> by platform specific parser.
* Use replaceIDs to generate unique IDs for body.
*/
function iconToSVG$1(icon, customisations) {
	const fullIcon = {
		...defaultIconProps$1,
		...icon
	};
	const fullCustomisations = {
		...defaultIconCustomisations$1,
		...customisations
	};
	const box = {
		left: fullIcon.left,
		top: fullIcon.top,
		width: fullIcon.width,
		height: fullIcon.height
	};
	let body = fullIcon.body;
	[fullIcon, fullCustomisations].forEach((props) => {
		const transformations = [];
		const hFlip = props.hFlip;
		const vFlip = props.vFlip;
		let rotation = props.rotate;
		if (hFlip) {
			if (vFlip) rotation += 2;
			else {
				transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
				transformations.push("scale(-1 1)");
				box.top = box.left = 0;
			}
		} else if (vFlip) {
			transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
			transformations.push("scale(1 -1)");
			box.top = box.left = 0;
		}
		let tempValue;
		if (rotation < 0) rotation -= Math.floor(rotation / 4) * 4;
		rotation = rotation % 4;
		switch (rotation) {
			case 1:
				tempValue = box.height / 2 + box.top;
				transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
				break;
			case 2:
				transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
				break;
			case 3:
				tempValue = box.width / 2 + box.left;
				transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
		}
		if (rotation % 2 === 1) {
			if (box.left !== box.top) {
				tempValue = box.left;
				box.left = box.top;
				box.top = tempValue;
			}
			if (box.width !== box.height) {
				tempValue = box.width;
				box.width = box.height;
				box.height = tempValue;
			}
		}
		if (transformations.length) body = wrapSVGContent$1(body, "<g transform=\"" + transformations.join(" ") + "\">", "</g>");
	});
	const customisationsWidth = fullCustomisations.width;
	const customisationsHeight = fullCustomisations.height;
	const boxWidth = box.width;
	const boxHeight = box.height;
	let width;
	let height;
	if (customisationsWidth === null) {
		height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
		width = calculateSize$1(height, boxWidth / boxHeight);
	} else {
		width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
		height = customisationsHeight === null ? calculateSize$1(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
	}
	const attributes = {};
	const setAttr = (prop, value) => {
		if (!isUnsetKeyword$1(value)) attributes[prop] = value.toString();
	};
	setAttr("width", width);
	setAttr("height", height);
	const viewBox = [
		box.left,
		box.top,
		boxWidth,
		boxHeight
	];
	attributes.viewBox = viewBox.join(" ");
	return {
		attributes,
		viewBox,
		body
	};
}
/**
* Regular expression for finding ids
*/
var regex = /\sid="(\S+)"/g;
/**
* Counters
*/
var counters = /* @__PURE__ */ new Map();
/**
* Get unique new ID
*/
function nextID(id) {
	id = id.replace(/[0-9]+$/, "") || "a";
	const count = counters.get(id) || 0;
	counters.set(id, count + 1);
	return count ? `${id}${count}` : id;
}
/**
* Replace IDs in SVG output with unique IDs
*/
function replaceIDs(body) {
	const ids = [];
	let match;
	while (match = regex.exec(body)) ids.push(match[1]);
	if (!ids.length) return body;
	const suffix = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
	ids.forEach((id) => {
		const newID = nextID(id);
		const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		body = body.replace(new RegExp("([#;\"])(" + escapedID + ")([\")]|\\.[a-z])", "g"), "$1" + newID + suffix + "$3");
	});
	body = body.replace(new RegExp(suffix, "g"), "");
	return body;
}
/**
* Local storate types and entries
*/
var storage = Object.create(null);
/**
* Set API module
*/
function setAPIModule(provider, item) {
	storage[provider] = item;
}
/**
* Get API module
*/
function getAPIModule(provider) {
	return storage[provider] || storage[""];
}
/**
* Create full API configuration from partial data
*/
function createAPIConfig(source) {
	let resources;
	if (typeof source.resources === "string") resources = [source.resources];
	else {
		resources = source.resources;
		if (!(resources instanceof Array) || !resources.length) return null;
	}
	return {
		resources,
		path: source.path || "/",
		maxURL: source.maxURL || 500,
		rotate: source.rotate || 750,
		timeout: source.timeout || 5e3,
		random: source.random === true,
		index: source.index || 0,
		dataAfterTimeout: source.dataAfterTimeout !== false
	};
}
/**
* Local storage
*/
var configStorage = Object.create(null);
/**
* Redundancy for API servers.
*
* API should have very high uptime because of implemented redundancy at server level, but
* sometimes bad things happen. On internet 100% uptime is not possible.
*
* There could be routing problems. Server might go down for whatever reason, but it takes
* few minutes to detect that downtime, so during those few minutes API might not be accessible.
*
* This script has some redundancy to mitigate possible network issues.
*
* If one host cannot be reached in 'rotate' (750 by default) ms, script will try to retrieve
* data from different host. Hosts have different configurations, pointing to different
* API servers hosted at different providers.
*/
var fallBackAPISources = ["https://api.simplesvg.com", "https://api.unisvg.com"];
var fallBackAPI = [];
while (fallBackAPISources.length > 0) if (fallBackAPISources.length === 1) fallBackAPI.push(fallBackAPISources.shift());
else if (Math.random() > .5) fallBackAPI.push(fallBackAPISources.shift());
else fallBackAPI.push(fallBackAPISources.pop());
configStorage[""] = createAPIConfig({ resources: ["https://api.iconify.design"].concat(fallBackAPI) });
/**
* Add custom config for provider
*/
function addAPIProvider(provider, customConfig) {
	const config = createAPIConfig(customConfig);
	if (config === null) return false;
	configStorage[provider] = config;
	return true;
}
/**
* Get API configuration
*/
function getAPIConfig(provider) {
	return configStorage[provider];
}
/**
* List API providers
*/
function listAPIProviders() {
	return Object.keys(configStorage);
}
var detectFetch = () => {
	let callback;
	try {
		callback = fetch;
		if (typeof callback === "function") return callback;
	} catch (err) {}
};
/**
* Fetch function
*/
var fetchModule = detectFetch();
/**
* Set custom fetch() function
*/
function setFetch(fetch) {
	fetchModule = fetch;
}
/**
* Get fetch() function. Used by Icon Finder Core
*/
function getFetch() {
	return fetchModule;
}
/**
* Calculate maximum icons list length for prefix
*/
function calculateMaxLength(provider, prefix) {
	const config = getAPIConfig(provider);
	if (!config) return 0;
	let result;
	if (!config.maxURL) result = 0;
	else {
		let maxHostLength = 0;
		config.resources.forEach((item) => {
			maxHostLength = Math.max(maxHostLength, item.length);
		});
		const url = prefix + ".json?icons=";
		result = config.maxURL - maxHostLength - config.path.length - url.length;
	}
	return result;
}
/**
* Should query be aborted, based on last HTTP status
*/
function shouldAbort(status) {
	return status === 404;
}
/**
* Prepare params
*/
var prepare = (provider, prefix, icons) => {
	const results = [];
	const maxLength = calculateMaxLength(provider, prefix);
	const type = "icons";
	let item = {
		type,
		provider,
		prefix,
		icons: []
	};
	let length = 0;
	icons.forEach((name, index) => {
		length += name.length + 1;
		if (length >= maxLength && index > 0) {
			results.push(item);
			item = {
				type,
				provider,
				prefix,
				icons: []
			};
			length = name.length;
		}
		item.icons.push(name);
	});
	results.push(item);
	return results;
};
/**
* Get path
*/
function getPath(provider) {
	if (typeof provider === "string") {
		const config = getAPIConfig(provider);
		if (config) return config.path;
	}
	return "/";
}
/**
* Load icons
*/
var send = (host, params, callback) => {
	if (!fetchModule) {
		callback("abort", 424);
		return;
	}
	let path = getPath(params.provider);
	switch (params.type) {
		case "icons": {
			const prefix = params.prefix;
			const iconsList = params.icons.join(",");
			const urlParams = new URLSearchParams({ icons: iconsList });
			path += prefix + ".json?" + urlParams.toString();
			break;
		}
		case "custom": {
			const uri = params.uri;
			path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
			break;
		}
		default:
			callback("abort", 400);
			return;
	}
	let defaultError = 503;
	fetchModule(host + path).then((response) => {
		const status = response.status;
		if (status !== 200) {
			setTimeout(() => {
				callback(shouldAbort(status) ? "abort" : "next", status);
			});
			return;
		}
		defaultError = 501;
		return response.json();
	}).then((data) => {
		if (typeof data !== "object" || data === null) {
			setTimeout(() => {
				if (data === 404) callback("abort", data);
				else callback("next", defaultError);
			});
			return;
		}
		setTimeout(() => {
			callback("success", data);
		});
	}).catch(() => {
		callback("next", defaultError);
	});
};
/**
* Export module
*/
var fetchAPIModule = {
	prepare,
	send
};
/**
* Remove callback
*/
function removeCallback(storages, id) {
	storages.forEach((storage) => {
		const items = storage.loaderCallbacks;
		if (items) storage.loaderCallbacks = items.filter((row) => row.id !== id);
	});
}
/**
* Update all callbacks for provider and prefix
*/
function updateCallbacks(storage) {
	if (!storage.pendingCallbacksFlag) {
		storage.pendingCallbacksFlag = true;
		setTimeout(() => {
			storage.pendingCallbacksFlag = false;
			const items = storage.loaderCallbacks ? storage.loaderCallbacks.slice(0) : [];
			if (!items.length) return;
			let hasPending = false;
			const provider = storage.provider;
			const prefix = storage.prefix;
			items.forEach((item) => {
				const icons = item.icons;
				const oldLength = icons.pending.length;
				icons.pending = icons.pending.filter((icon) => {
					if (icon.prefix !== prefix) return true;
					const name = icon.name;
					if (storage.icons[name]) icons.loaded.push({
						provider,
						prefix,
						name
					});
					else if (storage.missing.has(name)) icons.missing.push({
						provider,
						prefix,
						name
					});
					else {
						hasPending = true;
						return true;
					}
					return false;
				});
				if (icons.pending.length !== oldLength) {
					if (!hasPending) removeCallback([storage], item.id);
					item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
				}
			});
		});
	}
}
/**
* Unique id counter for callbacks
*/
var idCounter = 0;
/**
* Add callback
*/
function storeCallback(callback, icons, pendingSources) {
	const id = idCounter++;
	const abort = removeCallback.bind(null, pendingSources, id);
	if (!icons.pending.length) return abort;
	const item = {
		id,
		icons,
		callback,
		abort
	};
	pendingSources.forEach((storage) => {
		(storage.loaderCallbacks || (storage.loaderCallbacks = [])).push(item);
	});
	return abort;
}
/**
* Check if icons have been loaded
*/
function sortIcons(icons) {
	const result = {
		loaded: [],
		missing: [],
		pending: []
	};
	const storage = Object.create(null);
	icons.sort((a, b) => {
		if (a.provider !== b.provider) return a.provider.localeCompare(b.provider);
		if (a.prefix !== b.prefix) return a.prefix.localeCompare(b.prefix);
		return a.name.localeCompare(b.name);
	});
	let lastIcon = {
		provider: "",
		prefix: "",
		name: ""
	};
	icons.forEach((icon) => {
		if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) return;
		lastIcon = icon;
		const provider = icon.provider;
		const prefix = icon.prefix;
		const name = icon.name;
		const providerStorage = storage[provider] || (storage[provider] = Object.create(null));
		const localStorage = providerStorage[prefix] || (providerStorage[prefix] = getStorage(provider, prefix));
		let list;
		if (name in localStorage.icons) list = result.loaded;
		else if (prefix === "" || localStorage.missing.has(name)) list = result.missing;
		else list = result.pending;
		const item = {
			provider,
			prefix,
			name
		};
		list.push(item);
	});
	return result;
}
/**
* Convert icons list from string/icon mix to icons and validate them
*/
function listToIcons(list, validate = true, simpleNames = false) {
	const result = [];
	list.forEach((item) => {
		const icon = typeof item === "string" ? stringToIcon(item, validate, simpleNames) : item;
		if (icon) result.push(icon);
	});
	return result;
}
/**
* Default RedundancyConfig for API calls
*/
var defaultConfig$1 = {
	resources: [],
	index: 0,
	timeout: 2e3,
	rotate: 750,
	random: false,
	dataAfterTimeout: false
};
/**
* Send query
*/
function sendQuery(config, payload, query, done) {
	const resourcesCount = config.resources.length;
	const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
	let resources;
	if (config.random) {
		let list = config.resources.slice(0);
		resources = [];
		while (list.length > 1) {
			const nextIndex = Math.floor(Math.random() * list.length);
			resources.push(list[nextIndex]);
			list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
		}
		resources = resources.concat(list);
	} else resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
	const startTime = Date.now();
	let status = "pending";
	let queriesSent = 0;
	let lastError;
	let timer = null;
	let queue = [];
	let doneCallbacks = [];
	if (typeof done === "function") doneCallbacks.push(done);
	/**
	* Reset timer
	*/
	function resetTimer() {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}
	/**
	* Abort everything
	*/
	function abort() {
		if (status === "pending") status = "aborted";
		resetTimer();
		queue.forEach((item) => {
			if (item.status === "pending") item.status = "aborted";
		});
		queue = [];
	}
	/**
	* Add / replace callback to call when execution is complete.
	* This can be used to abort pending query implementations when query is complete or aborted.
	*/
	function subscribe(callback, overwrite) {
		if (overwrite) doneCallbacks = [];
		if (typeof callback === "function") doneCallbacks.push(callback);
	}
	/**
	* Get query status
	*/
	function getQueryStatus() {
		return {
			startTime,
			payload,
			status,
			queriesSent,
			queriesPending: queue.length,
			subscribe,
			abort
		};
	}
	/**
	* Fail query
	*/
	function failQuery() {
		status = "failed";
		doneCallbacks.forEach((callback) => {
			callback(void 0, lastError);
		});
	}
	/**
	* Clear queue
	*/
	function clearQueue() {
		queue.forEach((item) => {
			if (item.status === "pending") item.status = "aborted";
		});
		queue = [];
	}
	/**
	* Got response from module
	*/
	function moduleResponse(item, response, data) {
		const isError = response !== "success";
		queue = queue.filter((queued) => queued !== item);
		switch (status) {
			case "pending": break;
			case "failed":
				if (isError || !config.dataAfterTimeout) return;
				break;
			default: return;
		}
		if (response === "abort") {
			lastError = data;
			failQuery();
			return;
		}
		if (isError) {
			lastError = data;
			if (!queue.length) {
				if (!resources.length) failQuery();
				else execNext();
			}
			return;
		}
		resetTimer();
		clearQueue();
		if (!config.random) {
			const index = config.resources.indexOf(item.resource);
			if (index !== -1 && index !== config.index) config.index = index;
		}
		status = "completed";
		doneCallbacks.forEach((callback) => {
			callback(data);
		});
	}
	/**
	* Execute next query
	*/
	function execNext() {
		if (status !== "pending") return;
		resetTimer();
		const resource = resources.shift();
		if (resource === void 0) {
			if (queue.length) {
				timer = setTimeout(() => {
					resetTimer();
					if (status === "pending") {
						clearQueue();
						failQuery();
					}
				}, config.timeout);
				return;
			}
			failQuery();
			return;
		}
		const item = {
			status: "pending",
			resource,
			callback: (status, data) => {
				moduleResponse(item, status, data);
			}
		};
		queue.push(item);
		queriesSent++;
		timer = setTimeout(execNext, config.rotate);
		query(resource, payload, item.callback);
	}
	setTimeout(execNext);
	return getQueryStatus;
}
/**
* Redundancy instance
*/
function initRedundancy(cfg) {
	const config = {
		...defaultConfig$1,
		...cfg
	};
	let queries = [];
	/**
	* Remove aborted and completed queries
	*/
	function cleanup() {
		queries = queries.filter((item) => item().status === "pending");
	}
	/**
	* Send query
	*/
	function query(payload, queryCallback, doneCallback) {
		const query = sendQuery(config, payload, queryCallback, (data, error) => {
			cleanup();
			if (doneCallback) doneCallback(data, error);
		});
		queries.push(query);
		return query;
	}
	/**
	* Find instance
	*/
	function find(callback) {
		return queries.find((value) => {
			return callback(value);
		}) || null;
	}
	return {
		query,
		find,
		setIndex: (index) => {
			config.index = index;
		},
		getIndex: () => config.index,
		cleanup
	};
}
function emptyCallback$1() {}
var redundancyCache = Object.create(null);
/**
* Get Redundancy instance for provider
*/
function getRedundancyCache(provider) {
	if (!redundancyCache[provider]) {
		const config = getAPIConfig(provider);
		if (!config) return;
		redundancyCache[provider] = {
			config,
			redundancy: initRedundancy(config)
		};
	}
	return redundancyCache[provider];
}
/**
* Send API query
*/
function sendAPIQuery(target, query, callback) {
	let redundancy;
	let send;
	if (typeof target === "string") {
		const api = getAPIModule(target);
		if (!api) {
			callback(void 0, 424);
			return emptyCallback$1;
		}
		send = api.send;
		const cached = getRedundancyCache(target);
		if (cached) redundancy = cached.redundancy;
	} else {
		const config = createAPIConfig(target);
		if (config) {
			redundancy = initRedundancy(config);
			const api = getAPIModule(target.resources ? target.resources[0] : "");
			if (api) send = api.send;
		}
	}
	if (!redundancy || !send) {
		callback(void 0, 424);
		return emptyCallback$1;
	}
	return redundancy.query(query, send, callback)().abort;
}
function emptyCallback() {}
/**
* Function called when new icons have been loaded
*/
function loadedNewIcons(storage) {
	if (!storage.iconsLoaderFlag) {
		storage.iconsLoaderFlag = true;
		setTimeout(() => {
			storage.iconsLoaderFlag = false;
			updateCallbacks(storage);
		});
	}
}
/**
* Check icon names for API
*/
function checkIconNamesForAPI(icons) {
	const valid = [];
	const invalid = [];
	icons.forEach((name) => {
		(name.match(matchIconName) ? valid : invalid).push(name);
	});
	return {
		valid,
		invalid
	};
}
/**
* Parse loader response
*/
function parseLoaderResponse(storage, icons, data) {
	function checkMissing() {
		const pending = storage.pendingIcons;
		icons.forEach((name) => {
			if (pending) pending.delete(name);
			if (!storage.icons[name]) storage.missing.add(name);
		});
	}
	if (data && typeof data === "object") try {
		if (!addIconSet(storage, data).length) {
			checkMissing();
			return;
		}
	} catch (err) {
		console.error(err);
	}
	checkMissing();
	loadedNewIcons(storage);
}
/**
* Handle response that can be async
*/
function parsePossiblyAsyncResponse(response, callback) {
	if (response instanceof Promise) response.then((data) => {
		callback(data);
	}).catch(() => {
		callback(null);
	});
	else callback(response);
}
/**
* Load icons
*/
function loadNewIcons(storage, icons) {
	if (!storage.iconsToLoad) storage.iconsToLoad = icons;
	else storage.iconsToLoad = storage.iconsToLoad.concat(icons).sort();
	if (!storage.iconsQueueFlag) {
		storage.iconsQueueFlag = true;
		setTimeout(() => {
			storage.iconsQueueFlag = false;
			const { provider, prefix } = storage;
			const icons = storage.iconsToLoad;
			delete storage.iconsToLoad;
			if (!icons || !icons.length) return;
			const customIconLoader = storage.loadIcon;
			if (storage.loadIcons && (icons.length > 1 || !customIconLoader)) {
				parsePossiblyAsyncResponse(storage.loadIcons(icons, prefix, provider), (data) => {
					parseLoaderResponse(storage, icons, data);
				});
				return;
			}
			if (customIconLoader) {
				icons.forEach((name) => {
					parsePossiblyAsyncResponse(customIconLoader(name, prefix, provider), (data) => {
						parseLoaderResponse(storage, [name], data ? {
							prefix,
							icons: { [name]: data }
						} : null);
					});
				});
				return;
			}
			const { valid, invalid } = checkIconNamesForAPI(icons);
			if (invalid.length) parseLoaderResponse(storage, invalid, null);
			if (!valid.length) return;
			const api = prefix.match(matchIconName) ? getAPIModule(provider) : null;
			if (!api) {
				parseLoaderResponse(storage, valid, null);
				return;
			}
			api.prepare(provider, prefix, valid).forEach((item) => {
				sendAPIQuery(provider, item, (data) => {
					parseLoaderResponse(storage, item.icons, data);
				});
			});
		});
	}
}
/**
* Load icons
*/
var loadIcons = (icons, callback) => {
	const sortedIcons = sortIcons(listToIcons(icons, true, allowSimpleNames()));
	if (!sortedIcons.pending.length) {
		let callCallback = true;
		if (callback) setTimeout(() => {
			if (callCallback) callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
		});
		return () => {
			callCallback = false;
		};
	}
	const newIcons = Object.create(null);
	const sources = [];
	let lastProvider, lastPrefix;
	sortedIcons.pending.forEach((icon) => {
		const { provider, prefix } = icon;
		if (prefix === lastPrefix && provider === lastProvider) return;
		lastProvider = provider;
		lastPrefix = prefix;
		sources.push(getStorage(provider, prefix));
		const providerNewIcons = newIcons[provider] || (newIcons[provider] = Object.create(null));
		if (!providerNewIcons[prefix]) providerNewIcons[prefix] = [];
	});
	sortedIcons.pending.forEach((icon) => {
		const { provider, prefix, name } = icon;
		const storage = getStorage(provider, prefix);
		const pendingQueue = storage.pendingIcons || (storage.pendingIcons = /* @__PURE__ */ new Set());
		if (!pendingQueue.has(name)) {
			pendingQueue.add(name);
			newIcons[provider][prefix].push(name);
		}
	});
	sources.forEach((storage) => {
		const list = newIcons[storage.provider][storage.prefix];
		if (list.length) loadNewIcons(storage, list);
	});
	return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
};
/**
* Load one icon using Promise
*/
var loadIcon$1 = (icon) => {
	return new Promise((fulfill, reject) => {
		const iconObj = typeof icon === "string" ? stringToIcon(icon, true) : icon;
		if (!iconObj) {
			reject(icon);
			return;
		}
		loadIcons([iconObj || icon], (loaded) => {
			if (loaded.length && iconObj) {
				const data = getIconData(iconObj);
				if (data) {
					fulfill({
						...defaultIconProps$1,
						...data
					});
					return;
				}
			}
			reject(icon);
		});
	});
};
/**
* Set custom loader for multiple icons
*/
function setCustomIconsLoader(loader, prefix, provider) {
	getStorage("", prefix).loadIcons = loader;
}
/**
* Convert IconifyIconCustomisations to FullIconCustomisations, checking value types
*/
function mergeCustomisations(defaults, item) {
	const result = { ...defaults };
	for (const key in item) {
		const value = item[key];
		const valueType = typeof value;
		if (key in defaultIconSizeCustomisations$1) {
			if (value === null || value && (valueType === "string" || valueType === "number")) result[key] = value;
		} else if (valueType === typeof result[key]) result[key] = key === "rotate" ? value % 4 : value;
	}
	return result;
}
var separator = /[\s,]+/;
/**
* Apply "flip" string to icon customisations
*/
function flipFromString(custom, flip) {
	flip.split(separator).forEach((str) => {
		switch (str.trim()) {
			case "horizontal":
				custom.hFlip = true;
				break;
			case "vertical": custom.vFlip = true;
		}
	});
}
/**
* Get rotation value
*/
function rotateFromString(value, defaultValue = 0) {
	const units = value.replace(/^-?[0-9.]*/, "");
	function cleanup(value) {
		while (value < 0) value += 4;
		return value % 4;
	}
	if (units === "") {
		const num = parseInt(value);
		return isNaN(num) ? 0 : cleanup(num);
	} else if (units !== value) {
		let split = 0;
		switch (units) {
			case "%":
				split = 25;
				break;
			case "deg": split = 90;
		}
		if (split) {
			let num = parseFloat(value.slice(0, value.length - units.length));
			if (isNaN(num)) return 0;
			num = num / split;
			return num % 1 === 0 ? cleanup(num) : 0;
		}
	}
	return defaultValue;
}
/**
* Generate <svg>
*/
function iconToHTML$1(body, attributes) {
	let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : " xmlns:xlink=\"http://www.w3.org/1999/xlink\"";
	for (const attr in attributes) renderAttribsHTML += " " + attr + "=\"" + attributes[attr] + "\"";
	return "<svg xmlns=\"http://www.w3.org/2000/svg\"" + renderAttribsHTML + ">" + body + "</svg>";
}
/**
* Encode SVG for use in url()
*
* Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
* smaller code.
*/
function encodeSVGforURL$1(svg) {
	return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ").replace(/:/g, "%3A").replace(/\//g, "%2F");
}
/**
* Generate data: URL from SVG
*/
function svgToData$1(svg) {
	return "data:image/svg+xml," + encodeSVGforURL$1(svg);
}
/**
* Generate url() from SVG
*/
function svgToURL$1(svg) {
	return "url(\"" + svgToData$1(svg) + "\")";
}
var defaultExtendedIconCustomisations = {
	...defaultIconCustomisations$1,
	inline: false
};
/**
* Default SVG attributes
*/
var svgDefaults = {
	"xmlns": "http://www.w3.org/2000/svg",
	"xmlns:xlink": "http://www.w3.org/1999/xlink",
	"aria-hidden": true,
	"role": "img"
};
/**
* Style modes
*/
var commonProps = { display: "inline-block" };
var monotoneProps = { backgroundColor: "currentColor" };
var coloredProps = { backgroundColor: "transparent" };
var propsToAdd = {
	Image: "var(--svg)",
	Repeat: "no-repeat",
	Size: "100% 100%"
};
var propsToAddTo = {
	webkitMask: monotoneProps,
	mask: monotoneProps,
	background: coloredProps
};
for (const prefix in propsToAddTo) {
	const list = propsToAddTo[prefix];
	for (const prop in propsToAdd) list[prefix + prop] = propsToAdd[prop];
}
/**
* Aliases for customisations.
* In Vue 'v-' properties are reserved, so v-flip must be renamed
*/
var customisationAliases = {};
["horizontal", "vertical"].forEach((prefix) => {
	const attr = prefix.slice(0, 1) + "Flip";
	customisationAliases[prefix + "-flip"] = attr;
	customisationAliases[prefix.slice(0, 1) + "-flip"] = attr;
	customisationAliases[prefix + "Flip"] = attr;
});
/**
* Fix size: add 'px' to numbers
*/
function fixSize(value) {
	return value + (value.match(/^[-0-9.]+$/) ? "px" : "");
}
/**
* Render icon
*/
var render = (icon, props) => {
	const customisations = mergeCustomisations(defaultExtendedIconCustomisations, props);
	const componentProps = { ...svgDefaults };
	const mode = props.mode || "svg";
	const style = {};
	const propsStyle = props.style;
	const customStyle = typeof propsStyle === "object" && !(propsStyle instanceof Array) ? propsStyle : {};
	for (let key in props) {
		const value = props[key];
		if (value === void 0) continue;
		switch (key) {
			case "icon":
			case "style":
			case "onLoad":
			case "mode":
			case "ssr":
			case "customise": break;
			case "inline":
			case "hFlip":
			case "vFlip":
				customisations[key] = value === true || value === "true" || value === 1;
				break;
			case "flip": break;
			case "color":
				style.color = value;
				break;
			case "rotate":
				if (typeof value === "string") customisations[key] = rotateFromString(value);
				else if (typeof value === "number") customisations[key] = value;
				break;
			case "ariaHidden":
			case "aria-hidden":
				if (value !== true && value !== "true") delete componentProps["aria-hidden"];
				break;
			default: {
				const alias = customisationAliases[key];
				if (alias) {
					if (value === true || value === "true" || value === 1) customisations[alias] = true;
				} else if (defaultExtendedIconCustomisations[key] === void 0) componentProps[key] = value;
			}
		}
	}
	if (typeof props.flip === "string") flipFromString(customisations, props.flip);
	const item = iconToSVG$1(icon, customisations);
	const renderAttribs = item.attributes;
	if (customisations.inline) style.verticalAlign = "-0.125em";
	if (mode === "svg") {
		componentProps.style = {
			...style,
			...customStyle
		};
		Object.assign(componentProps, renderAttribs);
		componentProps["innerHTML"] = replaceIDs(item.body);
		return h("svg", componentProps);
	}
	const { body, width, height } = icon;
	const useMask = mode === "mask" || (mode === "bg" ? false : body.indexOf("currentColor") !== -1);
	const html = iconToHTML$1(body, {
		...renderAttribs,
		width: width + "",
		height: height + ""
	});
	componentProps.style = {
		...style,
		"--svg": svgToURL$1(html),
		"width": fixSize(renderAttribs.width),
		"height": fixSize(renderAttribs.height),
		...commonProps,
		...useMask ? monotoneProps : coloredProps,
		...customStyle
	};
	return h("span", componentProps);
};
/**
* Initialise stuff
*/
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
/**
* Empty icon data, rendered when icon is not available
*/
var emptyIcon = {
	...defaultIconProps$1,
	body: ""
};
/**
* Component
*/
var Icon = defineComponent((props, { emit }) => {
	const loader = ref(null);
	function abortLoading() {
		if (loader.value) {
			loader.value.abort?.();
			loader.value = null;
		}
	}
	const rendering = ref(!!props.ssr);
	const lastRenderedIconName = ref("");
	const iconData = shallowRef(null);
	function getIcon() {
		const icon = props.icon;
		if (typeof icon === "object" && icon !== null && typeof icon.body === "string") {
			lastRenderedIconName.value = "";
			return { data: icon };
		}
		let iconName;
		if (typeof icon !== "string" || (iconName = stringToIcon(icon, false, true)) === null) return null;
		let data = getIconData(iconName);
		if (!data) {
			const oldState = loader.value;
			if (!oldState || oldState.name !== icon) {
				if (data === null) loader.value = { name: icon };
				else loader.value = {
					name: icon,
					abort: loadIcons([iconName], updateIconData)
				};
			}
			return null;
		}
		abortLoading();
		if (lastRenderedIconName.value !== icon) {
			lastRenderedIconName.value = icon;
			nextTick(() => {
				emit("load", icon);
			});
		}
		const customise = props.customise;
		if (customise) {
			data = Object.assign({}, data);
			const customised = customise(data.body, iconName.name, iconName.prefix, iconName.provider);
			if (typeof customised === "string") data.body = customised;
		}
		const classes = ["iconify"];
		if (iconName.prefix !== "") classes.push("iconify--" + iconName.prefix);
		if (iconName.provider !== "") classes.push("iconify--" + iconName.provider);
		return {
			data,
			classes
		};
	}
	function updateIconData() {
		const icon = getIcon();
		if (!icon) iconData.value = null;
		else if (icon.data !== iconData.value?.data) iconData.value = icon;
	}
	if (rendering.value) updateIconData();
	watch(() => props.icon, updateIconData);
	return () => {
		const icon = iconData.value;
		if (!icon) return render(emptyIcon, props);
		let newProps = props;
		if (icon.classes) newProps = {
			...props,
			class: icon.classes.join(" ")
		};
		return render({
			...defaultIconProps$1,
			...icon.data
		}, newProps);
	};
}, {
	props: {
		icon: {
			type: [String, Object],
			required: true
		},
		mode: { type: String },
		ssr: { type: Boolean },
		width: { type: [String, Number] },
		height: { type: [String, Number] },
		style: { type: [String, Object] },
		color: { type: String },
		inline: { type: Boolean },
		rotate: { type: [Number, String] },
		hFlip: { type: Boolean },
		horizontalFlip: { type: Boolean },
		vFlip: { type: Boolean },
		verticalFlip: { type: Boolean },
		flip: { type: String },
		id: { type: String },
		ariaHidden: {
			type: [Boolean, String],
			default: void 0
		},
		customise: { type: Function },
		title: { type: String }
	},
	emits: ["load"]
});
/**
* Internal API
*/
var _api = {
	getAPIConfig,
	setAPIModule,
	sendAPIQuery,
	setFetch,
	getFetch,
	listAPIProviders
};
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/icon/defaults.js
/** Default values for dimensions */
var defaultIconDimensions = Object.freeze({
	left: 0,
	top: 0,
	width: 16,
	height: 16
});
/** Default values for transformations */
var defaultIconTransformations = Object.freeze({
	rotate: 0,
	vFlip: false,
	hFlip: false
});
/** Default values for all optional IconifyIcon properties */
var defaultIconProps = Object.freeze({
	...defaultIconDimensions,
	...defaultIconTransformations
});
Object.freeze({
	...defaultIconProps,
	body: "",
	hidden: false
});
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/icon/square.js
/**
* Make icon viewBox square
*/
function makeViewBoxSquare(viewBox) {
	const [left, top, width, height] = viewBox;
	if (width !== height) {
		const max = Math.max(width, height);
		return [
			left - (max - width) / 2,
			top - (max - height) / 2,
			max,
			max
		];
	}
	return viewBox;
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/svg/size.js
/**
* Regular expressions for calculating dimensions
*/
var unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
var unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function calculateSize(size, ratio, precision) {
	if (ratio === 1) return size;
	precision = precision || 100;
	if (typeof size === "number") return Math.ceil(size * ratio * precision) / precision;
	if (typeof size !== "string") return size;
	const oldParts = size.split(unitsSplit);
	if (oldParts === null || !oldParts.length) return size;
	const newParts = [];
	let code = oldParts.shift();
	let isNumber = unitsTest.test(code);
	while (true) {
		if (isNumber) {
			const num = parseFloat(code);
			if (isNaN(num)) newParts.push(code);
			else newParts.push(Math.ceil(num * ratio * precision) / precision);
		} else newParts.push(code);
		code = oldParts.shift();
		if (code === void 0) return newParts.join("");
		isNumber = !isNumber;
	}
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/customisations/defaults.js
/**
* Default icon customisations values
*/
var defaultIconSizeCustomisations = Object.freeze({
	width: null,
	height: null
});
var defaultIconCustomisations = Object.freeze({
	...defaultIconSizeCustomisations,
	...defaultIconTransformations
});
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/svg/defs.js
function splitSVGDefs(content, tag = "defs") {
	let defs = "";
	const index = content.indexOf("<" + tag);
	while (index >= 0) {
		const start = content.indexOf(">", index);
		const end = content.indexOf("</" + tag);
		if (start === -1 || end === -1) break;
		const endEnd = content.indexOf(">", end);
		if (endEnd === -1) break;
		defs += content.slice(start + 1, end).trim();
		content = content.slice(0, index).trim() + content.slice(endEnd + 1);
	}
	return {
		defs,
		content
	};
}
/**
* Merge defs and content
*/
function mergeDefsAndContent(defs, content) {
	return defs ? "<defs>" + defs + "</defs>" + content : content;
}
/**
* Wrap SVG content, without wrapping definitions
*/
function wrapSVGContent(body, start, end) {
	const split = splitSVGDefs(body);
	return mergeDefsAndContent(split.defs, start + split.content + end);
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/svg/build.js
/**
* Check if value should be unset. Allows multiple keywords
*/
var isUnsetKeyword = (value) => value === "unset" || value === "undefined" || value === "none";
/**
* Get SVG attributes and content from icon + customisations
*
* Does not generate style to make it compatible with frameworks that use objects for style, such as React.
* Instead, it generates 'inline' value. If true, rendering engine should add verticalAlign: -0.125em to icon.
*
* Customisations should be normalised by platform specific parser.
* Result should be converted to <svg> by platform specific parser.
* Use replaceIDs to generate unique IDs for body.
*/
function iconToSVG(icon, customisations) {
	const fullIcon = {
		...defaultIconProps,
		...icon
	};
	const fullCustomisations = {
		...defaultIconCustomisations,
		...customisations
	};
	const box = {
		left: fullIcon.left,
		top: fullIcon.top,
		width: fullIcon.width,
		height: fullIcon.height
	};
	let body = fullIcon.body;
	[fullIcon, fullCustomisations].forEach((props) => {
		const transformations = [];
		const hFlip = props.hFlip;
		const vFlip = props.vFlip;
		let rotation = props.rotate;
		if (hFlip) {
			if (vFlip) rotation += 2;
			else {
				transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
				transformations.push("scale(-1 1)");
				box.top = box.left = 0;
			}
		} else if (vFlip) {
			transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
			transformations.push("scale(1 -1)");
			box.top = box.left = 0;
		}
		let tempValue;
		if (rotation < 0) rotation -= Math.floor(rotation / 4) * 4;
		rotation = rotation % 4;
		switch (rotation) {
			case 1:
				tempValue = box.height / 2 + box.top;
				transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
				break;
			case 2:
				transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
				break;
			case 3:
				tempValue = box.width / 2 + box.left;
				transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
		}
		if (rotation % 2 === 1) {
			if (box.left !== box.top) {
				tempValue = box.left;
				box.left = box.top;
				box.top = tempValue;
			}
			if (box.width !== box.height) {
				tempValue = box.width;
				box.width = box.height;
				box.height = tempValue;
			}
		}
		if (transformations.length) body = wrapSVGContent(body, "<g transform=\"" + transformations.join(" ") + "\">", "</g>");
	});
	const customisationsWidth = fullCustomisations.width;
	const customisationsHeight = fullCustomisations.height;
	const boxWidth = box.width;
	const boxHeight = box.height;
	let width;
	let height;
	if (customisationsWidth === null) {
		height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
		width = calculateSize(height, boxWidth / boxHeight);
	} else {
		width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
		height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
	}
	const attributes = {};
	const setAttr = (prop, value) => {
		if (!isUnsetKeyword(value)) attributes[prop] = value.toString();
	};
	setAttr("width", width);
	setAttr("height", height);
	const viewBox = [
		box.left,
		box.top,
		boxWidth,
		boxHeight
	];
	attributes.viewBox = viewBox.join(" ");
	return {
		attributes,
		viewBox,
		body
	};
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/svg/url.js
/**
* Encode SVG for use in url()
*
* Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
* smaller code.
*/
function encodeSVGforURL(svg) {
	return svg.replace(/"/g, "'").replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E").replace(/\s+/g, " ");
}
/**
* Generate data: URL from SVG
*/
function svgToData(svg) {
	return "data:image/svg+xml," + encodeSVGforURL(svg);
}
/**
* Generate url() from SVG
*/
function svgToURL(svg) {
	return "url(\"" + svgToData(svg) + "\")";
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/svg/html.js
/**
* Generate <svg>
*/
function iconToHTML(body, attributes) {
	let renderAttribsHTML = body.indexOf("xlink:") === -1 ? "" : " xmlns:xlink=\"http://www.w3.org/1999/xlink\"";
	for (const attr in attributes) renderAttribsHTML += " " + attr + "=\"" + attributes[attr] + "\"";
	return "<svg xmlns=\"http://www.w3.org/2000/svg\"" + renderAttribsHTML + ">" + body + "</svg>";
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/css/common.js
/**
* Generates common CSS rules for multiple icons, rendered as background/mask
*/
function getCommonCSSRules(options) {
	const result = Object.create(null);
	Object.assign(result, {
		display: "inline-block",
		width: "1em",
		height: "1em"
	});
	const varName = options.varName;
	if (options.pseudoSelector) result["content"] = "''";
	switch (options.mode) {
		case "background":
			if (varName) result["background-image"] = "var(--" + varName + ")";
			result["background-repeat"] = "no-repeat";
			result["background-size"] = "100% 100%";
			break;
		case "mask":
			result["background-color"] = "currentColor";
			if (varName) result["mask-image"] = result["-webkit-mask-image"] = "var(--" + varName + ")";
			result["mask-repeat"] = result["-webkit-mask-repeat"] = "no-repeat";
			result["mask-size"] = result["-webkit-mask-size"] = "100% 100%";
	}
	return result;
}
/**
* Generate CSS rules for one icon, rendered as background/mask
*
* This function excludes common rules
*/
function generateItemCSSRules(icon, options) {
	const result = Object.create(null);
	const varName = options.varName;
	const buildResult = iconToSVG(icon);
	let viewBox = buildResult.viewBox;
	if (viewBox[2] !== viewBox[3]) {
		if (options.forceSquare) viewBox = makeViewBoxSquare(viewBox);
		else result["width"] = calculateSize("1em", viewBox[2] / viewBox[3]);
	}
	const url = svgToURL(iconToHTML(buildResult.body.replace(/currentColor/g, options.color || "black"), {
		viewBox: `${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`,
		width: `${viewBox[2]}`,
		height: `${viewBox[3]}`
	}));
	if (varName) result["--" + varName] = url;
	else switch (options.mode) {
		case "background":
			result["background-image"] = url;
			break;
		case "mask": result["mask-image"] = result["-webkit-mask-image"] = url;
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/css/format.js
var format = {
	selectorStart: {
		compressed: "{",
		compact: " {",
		expanded: " {"
	},
	selectorEnd: {
		compressed: "}",
		compact: "; }\n",
		expanded: ";\n}\n"
	},
	rule: {
		compressed: "{key}:",
		compact: " {key}: ",
		expanded: "\n  {key}: "
	}
};
/**
* Format data
*
* Key is selector, value is list of rules
*/
function formatCSS(data, mode = "expanded") {
	const results = [];
	for (let i = 0; i < data.length; i++) {
		const { selector, rules } = data[i];
		let entry = (selector instanceof Array ? selector.join(mode === "compressed" ? "," : ", ") : selector) + format.selectorStart[mode];
		let firstRule = true;
		for (const key in rules) {
			if (!firstRule) entry += ";";
			entry += format.rule[mode].replace("{key}", key) + rules[key];
			firstRule = false;
		}
		entry += format.selectorEnd[mode];
		results.push(entry);
	}
	return results.join(mode === "compressed" ? "" : "\n");
}
//#endregion
//#region node_modules/.pnpm/@iconify+utils@3.1.7/node_modules/@iconify/utils/lib/css/icon.js
/**
* Get CSS for icon, rendered as background or mask
*/
function getIconCSS(icon, options = {}) {
	const body = options.customise ? options.customise(icon.body) : icon.body;
	const mode = options.mode || (options.color || !body.includes("currentColor") ? "background" : "mask");
	let varName = options.varName;
	if (varName === void 0 && mode === "mask") varName = "svg";
	const newOptions = {
		...options,
		mode,
		varName
	};
	if (mode === "background") delete newOptions.varName;
	const rules = Object.create(null);
	Object.assign(rules, options.rules, getCommonCSSRules(newOptions), generateItemCSSRules({
		...defaultIconProps,
		...icon,
		body
	}, newOptions));
	return formatCSS([{
		selector: options.iconSelector || ".icon",
		rules
	}], newOptions.format);
}
//#endregion
//#region node_modules/.pnpm/@nuxt+icon@2.5.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7.0_magic-_bfgxbtfwxtmtgwuw4go3jwql4u/node_modules/@nuxt/icon/dist/runtime/components/shared.js
async function loadIcon(name, timeout) {
	if (!name) return null;
	const _icon = getIcon(name);
	if (_icon) return _icon;
	let timeoutWarn;
	const load = loadIcon$1(name).catch(() => {
		console.warn(`[Icon] failed to load icon \`${name}\``);
		return null;
	});
	if (timeout > 0) await Promise.race([load, new Promise((resolve) => {
		timeoutWarn = setTimeout(() => {
			console.warn(`[Icon] loading icon \`${name}\` timed out after ${timeout}ms`);
			resolve();
		}, timeout);
	})]).finally(() => clearTimeout(timeoutWarn));
	else await load;
	return getIcon(name);
}
function useResolvedName(getName) {
	const options = useAppConfig().icon;
	const collections = (options.collections || []).sort((a, b) => b.length - a.length);
	return computed(() => {
		const name = getName();
		const bare = name.startsWith(options.cssSelectorPrefix) ? name.slice(options.cssSelectorPrefix.length) : name;
		const resolved = options.aliases?.[bare] || bare;
		if (!resolved.includes(":")) {
			const collection = collections.find((c) => resolved.startsWith(c + "-"));
			return collection ? collection + ":" + resolved.slice(collection.length + 1) : resolved;
		}
		return resolved;
	});
}
function resolveCustomizeFn(customize, globalCustomize) {
	if (customize === false) return void 0;
	if (customize === true || customize === null) return globalCustomize;
	return customize;
}
//#endregion
//#region node_modules/.pnpm/@nuxt+icon@2.5.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7.0_magic-_bfgxbtfwxtmtgwuw4go3jwql4u/node_modules/@nuxt/icon/dist/runtime/components/css.js
var SYMBOL_SERVER_CSS = "NUXT_ICONS_SERVER_CSS";
function escapeCssSelector(selector) {
	return selector.replace(/([^\w-])/g, "\\$1");
}
var NuxtIconCss = /* @__PURE__ */ defineComponent({
	name: "NuxtIconCss",
	props: {
		name: {
			type: String,
			required: true
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props) {
		const nuxt = useNuxtApp();
		const options = useAppConfig().icon;
		const cssClass = computed(() => {
			if (!props.name) return "";
			const base = options.cssSelectorPrefix + props.name;
			if (typeof props.customize === "function") return base + "--customized-" + hash(props.customize.toString());
			return base;
		});
		const selector = computed(() => "." + escapeCssSelector(cssClass.value));
		function getCSS(icon, withLayer = true) {
			let iconSelector = selector.value;
			if (options.cssWherePseudo) iconSelector = `:where(${iconSelector})`;
			const css = getIconCSS(icon, {
				iconSelector,
				format: "compressed",
				customise: resolveCustomizeFn(props.customize, options.customize)
			});
			if (options.cssLayer && withLayer) return `@layer ${options.cssLayer} { ${css} }`;
			return css;
		}
		onServerPrefetch(async () => {
			if (!(useRuntimeConfig().icon || {})?.serverKnownCssClasses?.includes(cssClass.value)) {
				const icon = await loadIcon(props.name, options.fetchTimeout).catch(() => null);
				if (!icon) return null;
				let ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS];
				if (!ssrCSS) {
					ssrCSS = nuxt.vueApp._context.provides[SYMBOL_SERVER_CSS] = /* @__PURE__ */ new Map();
					nuxt.runWithContext(() => {
						useHead({ style: [() => {
							const sep = "";
							let css = Array.from(ssrCSS.values()).sort().join(sep);
							if (options.cssLayer) css = `@layer ${options.cssLayer} {${sep}${css}${sep}}`;
							return { innerHTML: css };
						}] }, { tagPriority: "low" });
					});
				}
				if (cssClass.value && !ssrCSS.has(cssClass.value)) {
					const css = getCSS(icon, false);
					ssrCSS.set(cssClass.value, css);
				}
				return null;
			}
		});
		return () => h("span", { class: ["iconify", cssClass.value] });
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/utils/debounce-tick.js
/**
* Debounce an async function so that repeated calls within the same tick are
* collapsed into a single call (plus a trailing call if arguments arrived
* while the debounced call was still pending).
*
* Adapted from https://github.com/unjs/perfect-debounce with the timeout
* replaced by Vue's post-flush callback queue.
*/
function debounceTick(fn, options = {}) {
	let leadingValue;
	let active = false;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		const promise = _applyPromised(fn, _this, args);
		currentPromise = promise;
		promise.finally(() => {
			currentPromise = void 0;
			if (trailingArgs && !active) {
				const args = trailingArgs;
				trailingArgs = void 0;
				applyFn(_this, args);
			}
		});
		return promise;
	};
	return function(...args) {
		trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = options.leading && !active;
			if (!active) {
				active = true;
				queuePostFlushCb(() => {
					active = false;
					const flushArgs = trailingArgs ?? args;
					trailingArgs = void 0;
					const promise = options.leading ? leadingValue : applyFn(this, flushArgs);
					for (const _resolve of resolveList) _resolve(promise);
					resolveList = [];
				});
			}
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}
defineComponent({
	name: "ServerPlaceholder",
	render() {
		return createElementBlock("div");
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/client-only.js
var clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
	name: "ClientOnly",
	inheritAttrs: false,
	props: [
		"fallback",
		"placeholder",
		"placeholderTag",
		"fallbackTag"
	],
	setup(props, { slots, attrs }) {
		const mounted = shallowRef(false);
		const vm = getCurrentInstance();
		if (vm) vm._nuxtClientOnly = true;
		provide(clientOnlySymbol, true);
		return () => {
			if (mounted.value) {
				const vnodes = slots.default?.();
				if (vnodes && vnodes.length === 1 && true) return [cloneVNode(vnodes[0], attrs)];
				return vnodes;
			}
			const slot = slots.fallback || slots.placeholder;
			if (slot) return h(slot);
			const fallbackStr = props.fallback || props.placeholder || "";
			const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
			return createElementBlock(fallbackTag, attrs, fallbackStr);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/data.js
/**
* E3xxx
* Data fetching (useFetch / useAsyncData) runtime diagnostics.
*/
var dataDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/asyncData.js
/** @internal */
function _createUseAsyncData(options = {}) {
	{
		function useAsyncData(...args) {
			const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
			if (_isAutoKeyNeeded(args[0], args[1])) args.unshift(autoKey);
			let [_key, _handler, opts = {}] = args;
			const key = isRef(_key) || typeof _key === "function" ? computed(() => toValue(_key)) : { value: _key };
			if (!key.value || typeof key.value !== "string") throw dataDiagnostics.NUXT_E3008();
			if (typeof _handler !== "function") throw dataDiagnostics.NUXT_E3009();
			const shouldFactoryOptionsOverride = typeof options === "function";
			const nuxtApp = useNuxtApp();
			const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
			if (!shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				if (opts[key] !== void 0) continue;
				opts[key] = factoryOptions[key];
			}
			opts.server ??= true;
			opts.default ??= getDefault;
			opts.getCachedData ??= getDefaultCachedData;
			opts.lazy ??= false;
			opts.immediate ??= true;
			opts.deep ??= asyncDataDefaults.deep;
			opts.dedupe ??= "cancel";
			opts.enabled ??= true;
			if (shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				opts[key] = factoryOptions[key];
			}
			nuxtApp._asyncData[key.value];
			function createInitialFetch() {
				const initialFetchOptions = {
					cause: "initial",
					dedupe: opts.dedupe
				};
				const existing = nuxtApp._asyncData[key.value];
				if (!existing?._init) {
					initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
					nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
					nuxtApp._asyncData[key.value]._initialCachedData = initialFetchOptions.cachedData;
				} else if (nuxtApp._asyncDataPromises[key.value]) initialFetchOptions.cachedData = existing._initialCachedData;
				return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
			}
			const initialFetch = createInitialFetch();
			const asyncData = nuxtApp._asyncData[key.value];
			asyncData._deps++;
			const fetchOnServer = opts.server !== false && nuxtApp.payload.serverRendered;
			const isWithinVaporComponent = () => {
				return false;
			};
			if (fetchOnServer && opts.immediate) {
				const promise = initialFetch();
				if (getCurrentInstance() || isWithinVaporComponent()) onServerPrefetch(() => promise);
				else nuxtApp.hook("app:created", async () => {
					await promise;
				});
			}
			const asyncReturn = {
				data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data, !opts.deep),
				pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
				status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
				error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
				refresh: (...args) => {
					if (!nuxtApp._asyncData[key.value]?._init) return createInitialFetch()();
					return nuxtApp._asyncData[key.value].execute(...args);
				},
				execute: (...args) => asyncReturn.refresh(...args),
				clear: () => {
					const entry = nuxtApp._asyncData[key.value];
					if (entry?._abortController) try {
						entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
					} finally {
						entry._abortController = void 0;
					}
					clearNuxtDataByKey(nuxtApp, key.value);
				}
			};
			const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
			Object.assign(asyncDataPromise, asyncReturn);
			Object.defineProperties(asyncDataPromise, {
				then: {
					enumerable: true,
					value: asyncDataPromise.then.bind(asyncDataPromise)
				},
				catch: {
					enumerable: true,
					value: asyncDataPromise.catch.bind(asyncDataPromise)
				},
				finally: {
					enumerable: true,
					value: asyncDataPromise.finally.bind(asyncDataPromise)
				}
			});
			return asyncDataPromise;
		}
		return useAsyncData;
	}
}
var useAsyncData = _createUseAsyncData();
function writableComputedRef(getter, shallow = false) {
	const forwardedRef = computed({
		get() {
			return getter()?.value;
		},
		set(value) {
			const ref = getter();
			if (ref) ref.value = value;
		}
	});
	if (shallow) forwardedRef.__v_isShallow = true;
	return forwardedRef;
}
/** @internal */
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
	if (typeof keyOrFetcher === "string") return false;
	if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) return false;
	if (typeof keyOrFetcher === "function" && typeof fetcher === "function") return false;
	return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
	delete nuxtApp.payload.data[key];
	delete nuxtApp.payload._errors[key];
	if (nuxtApp._asyncData[key]) {
		nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
		nuxtApp._asyncData[key].error.value = void 0;
		nuxtApp._asyncData[key].status.value = "idle";
		nuxtApp._asyncData[key]._initialCachedData = void 0;
	}
	delete nuxtApp._asyncDataPromises[key];
}
function pick(obj, keys) {
	const newObj = {};
	for (const key of keys) newObj[key] = obj[key];
	return newObj;
}
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
	nuxtApp.payload._errors[key] ??= void 0;
	const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
	const handler = _handler ;
	const _ref = options.deep ? ref : shallowRef;
	const hasCachedData = initialCachedData !== void 0;
	const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
		if (!keys || keys.includes(key)) await asyncData.execute({ cause: "refresh:hook" });
	});
	const asyncData = {
		data: _ref(hasCachedData ? initialCachedData : options.default()),
		pending: computed(() => asyncData.status.value === "pending"),
		error: toRef(nuxtApp.payload._errors, key),
		status: shallowRef("idle"),
		execute: (...args) => {
			const [_opts, newValue = void 0] = args;
			const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
			if (nuxtApp._asyncDataPromises[key]) {
				if ((opts.dedupe ?? options.dedupe) === "defer") return nuxtApp._asyncDataPromises[key];
			}
			{
				const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
				if (cachedData !== void 0) {
					if (options.serialize !== false) nuxtApp.payload.data[key] = cachedData;
					asyncData.data.value = cachedData;
					asyncData.error.value = void 0;
					asyncData.status.value = "success";
					return Promise.resolve(cachedData);
				}
			}
			if (toValue(options.enabled) === false) return Promise.resolve(asyncData.data.value);
			if (asyncData._abortController) asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
			asyncData._abortController = new AbortController();
			asyncData.status.value = "pending";
			const cleanupController = new AbortController();
			const promise = new Promise((resolve, reject) => {
				try {
					const timeout = opts.timeout ?? options.timeout;
					const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
					if (mergedSignal.aborted) {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
						return;
					}
					mergedSignal.addEventListener("abort", () => {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
					}, {
						once: true,
						signal: cleanupController.signal
					});
					const ctx = { signal: mergedSignal };
					let run = () => Promise.resolve(handler(nuxtApp, ctx));
					if (options.middleware?.length) for (let i = options.middleware.length - 1; i >= 0; i--) {
						const middleware = options.middleware[i];
						const next = run;
						run = () => Promise.resolve(middleware(next, ctx));
					}
					return run().then(resolve, reject);
				} catch (err) {
					reject(err);
				}
			}).then(async (_result) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return;
				let result = _result;
				if (options.transform) result = await options.transform(_result);
				if (options.pick) result = pick(result, options.pick);
				if (options.serialize !== false) nuxtApp.payload.data[key] = result;
				asyncData.data.value = result;
				asyncData.error.value = void 0;
				asyncData.status.value = "success";
			}).catch((error) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return nuxtApp._asyncDataPromises[key];
				if (asyncData._abortController?.signal.aborted) return nuxtApp._asyncDataPromises[key];
				if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
					asyncData.status.value = "idle";
					return nuxtApp._asyncDataPromises[key];
				}
				asyncData.error.value = createError(error);
				asyncData.data.value = unref(options.default());
				asyncData.status.value = "error";
			}).finally(() => {
				cleanupController.abort();
				if (nuxtApp._asyncDataPromises[key] === promise) delete nuxtApp._asyncDataPromises[key];
			});
			nuxtApp._asyncDataPromises[key] = promise;
			return nuxtApp._asyncDataPromises[key];
		},
		_execute: debounceTick((...args) => asyncData.execute(...args)),
		_default: options.default,
		_deps: 0,
		_init: true,
		_hash: void 0,
		_off: () => {
			unsubRefreshAsyncData();
			if (nuxtApp._asyncData[key] !== asyncData) return;
			if (nuxtApp._asyncData[key]?._init) nuxtApp._asyncData[key]._init = false;
			if (nuxtApp._asyncDataPromises[key]) {
				asyncData._abortController?.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
				delete nuxtApp._asyncDataPromises[key];
				if (asyncData.status.value === "pending") asyncData.status.value = "idle";
			}
			if (!hasCustomGetCachedData) nextTick(() => {
				if (!nuxtApp._asyncData[key]?._init) {
					clearNuxtDataByKey(nuxtApp, key);
					asyncData.execute = () => Promise.resolve();
				}
			});
		}
	};
	return asyncData;
}
var getDefault = () => void 0;
var getDefaultCachedData = (key, nuxtApp, ctx) => {
	if (nuxtApp.isHydrating) return nuxtApp.payload.data[key];
	if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") return nuxtApp.static.data[key];
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
	const list = signals.filter((s) => !!s);
	if (typeof timeout === "number" && timeout >= 0) {
		const timeoutSignal = AbortSignal.timeout?.(timeout);
		if (timeoutSignal) list.push(timeoutSignal);
	}
	if (AbortSignal.any) return AbortSignal.any(list);
	const controller = new AbortController();
	for (const sig of list) if (sig.aborted) {
		const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
		return controller.signal;
	}
	const onAbort = () => {
		const reason = list.find((s) => s.aborted)?.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
	};
	for (const sig of list) sig.addEventListener?.("abort", onAbort, {
		once: true,
		signal: cleanupSignal
	});
	return controller.signal;
}
//#endregion
//#region node_modules/.pnpm/@nuxt+icon@2.5.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7.0_magic-_bfgxbtfwxtmtgwuw4go3jwql4u/node_modules/@nuxt/icon/dist/runtime/components/svg.js
var NuxtIconSvg = /* @__PURE__ */ defineComponent({
	name: "NuxtIconSvg",
	props: {
		name: {
			type: String,
			required: true
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props, { slots }) {
		useNuxtApp();
		const options = useAppConfig().icon;
		const name = useResolvedName(() => props.name);
		const storeKey = "i-" + name.value;
		if (name.value) onServerPrefetch(async () => {
			await useAsyncData(storeKey, async () => await loadIcon(name.value, options.fetchTimeout), { deep: false });
		});
		return () => h(Icon, {
			icon: name.value,
			ssr: true,
			customise: resolveCustomizeFn(props.customize, options.customize)
		}, slots);
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+icon@2.5.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7.0_magic-_bfgxbtfwxtmtgwuw4go3jwql4u/node_modules/@nuxt/icon/dist/runtime/components/index.js
var components_exports = /* @__PURE__ */ __exportAll({ default: () => components_default });
var components_default = defineComponent({
	name: "NuxtIcon",
	props: {
		name: {
			type: String,
			required: true
		},
		mode: {
			type: String,
			required: false,
			default: null
		},
		size: {
			type: [Number, String],
			required: false,
			default: null
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			default: null,
			required: false
		}
	},
	setup(props, { slots }) {
		const nuxtApp = useNuxtApp();
		const runtimeOptions = useAppConfig().icon;
		const name = useResolvedName(() => props.name);
		const component = computed(() => nuxtApp.vueApp?.component(name.value) || ((props.mode || runtimeOptions.mode) === "svg" ? NuxtIconSvg : NuxtIconCss));
		const style = computed(() => {
			const size = props.size || runtimeOptions.size;
			return size ? { fontSize: Number.isNaN(+size) ? size : size + "px" } : null;
		});
		return () => h(component.value, {
			...runtimeOptions.attrs,
			name: name.value,
			class: runtimeOptions.class,
			style: style.value,
			customize: props.customize
		}, slots);
	}
});

const componentsBP2DGhnz = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	a: setCustomIconsLoader,
	c: isEqual$1,
	i: addAPIProvider,
	l: serialize,
	n: components_exports,
	o: useAppConfig,
	r: _api,
	s: inlineConfig,
	t: components_default,
	u: klona
}, Symbol.toStringTag, { value: 'Module' }));

//#region node_modules/.pnpm/destr@2.0.5/node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
	if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
		warnKeyDropped(key);
		return;
	}
	return value;
}
function warnKeyDropped(key) {
	console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
	if (typeof value !== "string") return value;
	if (value[0] === "\"" && value[value.length - 1] === "\"" && value.indexOf("\\") === -1) return value.slice(1, -1);
	const _value = value.trim();
	if (_value.length <= 9) switch (_value.toLowerCase()) {
		case "true": return true;
		case "false": return false;
		case "undefined": return;
		case "null": return null;
		case "nan": return NaN;
		case "infinity": return Number.POSITIVE_INFINITY;
		case "-infinity": return Number.NEGATIVE_INFINITY;
	}
	if (!JsonSigRx.test(value)) {
		if (options.strict) throw new SyntaxError("[destr] Invalid JSON");
		return value;
	}
	try {
		if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
			if (options.strict) throw new Error("[destr] Possible prototype pollution");
			return JSON.parse(value, jsonParseTransform);
		}
		return JSON.parse(value);
	} catch (error) {
		if (options.strict) throw error;
		return value;
	}
}
//#endregion
//#region node_modules/.pnpm/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/shared/node-fetch-native.DfbY2q-x.mjs
var t = Object.defineProperty;
var o$1 = (e, l) => t(e, "name", {
	value: l,
	configurable: true
});
var n$2 = typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : typeof self < "u" ? self : {};
function f(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
o$1(f, "getDefaultExportFromCjs");
//#endregion
//#region node_modules/.pnpm/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/node.mjs
var Os = Object.defineProperty;
var fi = (i) => {
	throw TypeError(i);
};
var n$1 = (i, o) => Os(i, "name", {
	value: o,
	configurable: true
});
var ci = (i, o, a) => o.has(i) || fi("Cannot " + a);
var O = (i, o, a) => (ci(i, o, "read from private field"), a ? a.call(i) : o.get(i));
var be = (i, o, a) => o.has(i) ? fi("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(i) : o.set(i, a);
var X = (i, o, a, f) => (ci(i, o, "write to private field"), o.set(i, a), a);
var ve;
var zt;
var bt;
var Cr;
var ze;
var It;
var Ft;
var mt;
var ee;
var yt;
var He;
var Ve;
var gt;
function Us(i) {
	if (!/^data:/i.test(i)) throw new TypeError("`uri` does not appear to be a Data URI (must begin with \"data:\")");
	i = i.replace(/\r?\n/g, "");
	const o = i.indexOf(",");
	if (o === -1 || o <= 4) throw new TypeError("malformed data: URI");
	const a = i.substring(5, o).split(";");
	let f = "", l = false;
	const p = a[0] || "text/plain";
	let h = p;
	for (let A = 1; A < a.length; A++) a[A] === "base64" ? l = true : a[A] && (h += `;${a[A]}`, a[A].indexOf("charset=") === 0 && (f = a[A].substring(8)));
	!a[0] && !f.length && (h += ";charset=US-ASCII", f = "US-ASCII");
	const S = l ? "base64" : "ascii", v = unescape(i.substring(o + 1)), w = Buffer.from(v, S);
	return w.type = p, w.typeFull = h, w.charset = f, w;
}
n$1(Us, "dataUriToBuffer");
var pi = {};
var kt = { exports: {} };
/**
* @license
* web-streams-polyfill v3.3.3
* Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
* This code is released under the MIT license.
* SPDX-License-Identifier: MIT
*/ var xs = kt.exports;
var bi;
function Ns() {
	return bi || (bi = 1, function(i, o) {
		(function(a, f) {
			f(o);
		})(xs, function(a) {
			function f() {}
			n$1(f, "noop");
			function l(e) {
				return typeof e == "object" && e !== null || typeof e == "function";
			}
			n$1(l, "typeIsObject");
			const p = f;
			function h(e, t) {
				try {
					Object.defineProperty(e, "name", {
						value: t,
						configurable: !0
					});
				} catch {}
			}
			n$1(h, "setFunctionName");
			const S = Promise, v = Promise.prototype.then, w = Promise.reject.bind(S);
			function A(e) {
				return new S(e);
			}
			n$1(A, "newPromise");
			function T(e) {
				return A((t) => t(e));
			}
			n$1(T, "promiseResolvedWith");
			function b(e) {
				return w(e);
			}
			n$1(b, "promiseRejectedWith");
			function q(e, t, r) {
				return v.call(e, t, r);
			}
			n$1(q, "PerformPromiseThen");
			function g(e, t, r) {
				q(q(e, t, r), void 0, p);
			}
			n$1(g, "uponPromise");
			function V(e, t) {
				g(e, t);
			}
			n$1(V, "uponFulfillment");
			function I(e, t) {
				g(e, void 0, t);
			}
			n$1(I, "uponRejection");
			function F(e, t, r) {
				return q(e, t, r);
			}
			n$1(F, "transformPromiseWith");
			function Q(e) {
				q(e, void 0, p);
			}
			n$1(Q, "setPromiseIsHandledToTrue");
			let ge = n$1((e) => {
				if (typeof queueMicrotask == "function") ge = queueMicrotask;
				else {
					const t = T(void 0);
					ge = n$1((r) => q(t, r), "_queueMicrotask");
				}
				return ge(e);
			}, "_queueMicrotask");
			function z(e, t, r) {
				if (typeof e != "function") throw new TypeError("Argument is not a function");
				return Function.prototype.apply.call(e, t, r);
			}
			n$1(z, "reflectCall");
			function j(e, t, r) {
				try {
					return T(z(e, t, r));
				} catch (s) {
					return b(s);
				}
			}
			n$1(j, "promiseCall");
			const U = 16384, bn = class bn {
				constructor() {
					this._cursor = 0, this._size = 0, this._front = {
						_elements: [],
						_next: void 0
					}, this._back = this._front, this._cursor = 0, this._size = 0;
				}
				get length() {
					return this._size;
				}
				push(t) {
					const r = this._back;
					let s = r;
					r._elements.length === 16383 && (s = {
						_elements: [],
						_next: void 0
					}), r._elements.push(t), s !== r && (this._back = s, r._next = s), ++this._size;
				}
				shift() {
					const t = this._front;
					let r = t;
					const s = this._cursor;
					let u = s + 1;
					const c = t._elements, d = c[s];
					return u === U && (r = t._next, u = 0), --this._size, this._cursor = u, t !== r && (this._front = r), c[s] = void 0, d;
				}
				forEach(t) {
					let r = this._cursor, s = this._front, u = s._elements;
					for (; (r !== u.length || s._next !== void 0) && !(r === u.length && (s = s._next, u = s._elements, r = 0, u.length === 0));) t(u[r]), ++r;
				}
				peek() {
					const t = this._front, r = this._cursor;
					return t._elements[r];
				}
			};
			n$1(bn, "SimpleQueue");
			let D = bn;
			const jt = Symbol("[[AbortSteps]]"), Qn = Symbol("[[ErrorSteps]]"), Ar = Symbol("[[CancelSteps]]"), Br = Symbol("[[PullSteps]]"), kr = Symbol("[[ReleaseSteps]]");
			function Yn(e, t) {
				e._ownerReadableStream = t, t._reader = e, t._state === "readable" ? qr(e) : t._state === "closed" ? xi(e) : Gn(e, t._storedError);
			}
			n$1(Yn, "ReadableStreamReaderGenericInitialize");
			function Wr(e, t) {
				const r = e._ownerReadableStream;
				return ie(r, t);
			}
			n$1(Wr, "ReadableStreamReaderGenericCancel");
			function _e(e) {
				const t = e._ownerReadableStream;
				t._state === "readable" ? Or(e, /* @__PURE__ */ new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")) : Ni(e, /* @__PURE__ */ new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")), t._readableStreamController[kr](), t._reader = void 0, e._ownerReadableStream = void 0;
			}
			n$1(_e, "ReadableStreamReaderGenericRelease");
			function Lt(e) {
				return /* @__PURE__ */ new TypeError("Cannot " + e + " a stream using a released reader");
			}
			n$1(Lt, "readerLockException");
			function qr(e) {
				e._closedPromise = A((t, r) => {
					e._closedPromise_resolve = t, e._closedPromise_reject = r;
				});
			}
			n$1(qr, "defaultReaderClosedPromiseInitialize");
			function Gn(e, t) {
				qr(e), Or(e, t);
			}
			n$1(Gn, "defaultReaderClosedPromiseInitializeAsRejected");
			function xi(e) {
				qr(e), Zn(e);
			}
			n$1(xi, "defaultReaderClosedPromiseInitializeAsResolved");
			function Or(e, t) {
				e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
			}
			n$1(Or, "defaultReaderClosedPromiseReject");
			function Ni(e, t) {
				Gn(e, t);
			}
			n$1(Ni, "defaultReaderClosedPromiseResetToRejected");
			function Zn(e) {
				e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0);
			}
			n$1(Zn, "defaultReaderClosedPromiseResolve");
			const Kn = Number.isFinite || function(e) {
				return typeof e == "number" && isFinite(e);
			}, Hi = Math.trunc || function(e) {
				return e < 0 ? Math.ceil(e) : Math.floor(e);
			};
			function Vi(e) {
				return typeof e == "object" || typeof e == "function";
			}
			n$1(Vi, "isDictionary");
			function ue(e, t) {
				if (e !== void 0 && !Vi(e)) throw new TypeError(`${t} is not an object.`);
			}
			n$1(ue, "assertDictionary");
			function Z(e, t) {
				if (typeof e != "function") throw new TypeError(`${t} is not a function.`);
			}
			n$1(Z, "assertFunction");
			function Qi(e) {
				return typeof e == "object" && e !== null || typeof e == "function";
			}
			n$1(Qi, "isObject");
			function Jn(e, t) {
				if (!Qi(e)) throw new TypeError(`${t} is not an object.`);
			}
			n$1(Jn, "assertObject");
			function Se(e, t, r) {
				if (e === void 0) throw new TypeError(`Parameter ${t} is required in '${r}'.`);
			}
			n$1(Se, "assertRequiredArgument");
			function zr(e, t, r) {
				if (e === void 0) throw new TypeError(`${t} is required in '${r}'.`);
			}
			n$1(zr, "assertRequiredField");
			function Ir(e) {
				return Number(e);
			}
			n$1(Ir, "convertUnrestrictedDouble");
			function Xn(e) {
				return e === 0 ? 0 : e;
			}
			n$1(Xn, "censorNegativeZero");
			function Yi(e) {
				return Xn(Hi(e));
			}
			n$1(Yi, "integerPart");
			function Fr(e, t) {
				const s = Number.MAX_SAFE_INTEGER;
				let u = Number(e);
				if (u = Xn(u), !Kn(u)) throw new TypeError(`${t} is not a finite number`);
				if (u = Yi(u), u < 0 || u > s) throw new TypeError(`${t} is outside the accepted range of 0 to ${s}, inclusive`);
				return !Kn(u) || u === 0 ? 0 : u;
			}
			n$1(Fr, "convertUnsignedLongLongWithEnforceRange");
			function jr(e, t) {
				if (!We(e)) throw new TypeError(`${t} is not a ReadableStream.`);
			}
			n$1(jr, "assertReadableStream");
			function Qe(e) {
				return new fe(e);
			}
			n$1(Qe, "AcquireReadableStreamDefaultReader");
			function eo(e, t) {
				e._reader._readRequests.push(t);
			}
			n$1(eo, "ReadableStreamAddReadRequest");
			function Lr(e, t, r) {
				const u = e._reader._readRequests.shift();
				r ? u._closeSteps() : u._chunkSteps(t);
			}
			n$1(Lr, "ReadableStreamFulfillReadRequest");
			function $t(e) {
				return e._reader._readRequests.length;
			}
			n$1($t, "ReadableStreamGetNumReadRequests");
			function to(e) {
				const t = e._reader;
				return !(t === void 0 || !Ee(t));
			}
			n$1(to, "ReadableStreamHasDefaultReader");
			const mn = class mn {
				constructor(t) {
					if (Se(t, 1, "ReadableStreamDefaultReader"), jr(t, "First parameter"), qe(t)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
					Yn(this, t), this._readRequests = new D();
				}
				get closed() {
					return Ee(this) ? this._closedPromise : b(Dt("closed"));
				}
				cancel(t = void 0) {
					return Ee(this) ? this._ownerReadableStream === void 0 ? b(Lt("cancel")) : Wr(this, t) : b(Dt("cancel"));
				}
				read() {
					if (!Ee(this)) return b(Dt("read"));
					if (this._ownerReadableStream === void 0) return b(Lt("read from"));
					let t, r;
					const s = A((c, d) => {
						t = c, r = d;
					});
					return _t(this, {
						_chunkSteps: n$1((c) => t({
							value: c,
							done: false
						}), "_chunkSteps"),
						_closeSteps: n$1(() => t({
							value: void 0,
							done: true
						}), "_closeSteps"),
						_errorSteps: n$1((c) => r(c), "_errorSteps")
					}), s;
				}
				releaseLock() {
					if (!Ee(this)) throw Dt("releaseLock");
					this._ownerReadableStream !== void 0 && Gi(this);
				}
			};
			n$1(mn, "ReadableStreamDefaultReader");
			let fe = mn;
			Object.defineProperties(fe.prototype, {
				cancel: { enumerable: true },
				read: { enumerable: true },
				releaseLock: { enumerable: true },
				closed: { enumerable: true }
			}), h(fe.prototype.cancel, "cancel"), h(fe.prototype.read, "read"), h(fe.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(fe.prototype, Symbol.toStringTag, {
				value: "ReadableStreamDefaultReader",
				configurable: true
			});
			function Ee(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readRequests") ? false : e instanceof fe;
			}
			n$1(Ee, "IsReadableStreamDefaultReader");
			function _t(e, t) {
				const r = e._ownerReadableStream;
				r._disturbed = true, r._state === "closed" ? t._closeSteps() : r._state === "errored" ? t._errorSteps(r._storedError) : r._readableStreamController[Br](t);
			}
			n$1(_t, "ReadableStreamDefaultReaderRead");
			function Gi(e) {
				_e(e);
				ro(e, /* @__PURE__ */ new TypeError("Reader was released"));
			}
			n$1(Gi, "ReadableStreamDefaultReaderRelease");
			function ro(e, t) {
				const r = e._readRequests;
				e._readRequests = new D(), r.forEach((s) => {
					s._errorSteps(t);
				});
			}
			n$1(ro, "ReadableStreamDefaultReaderErrorReadRequests");
			function Dt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`);
			}
			n$1(Dt, "defaultReaderBrandCheckException");
			const Zi = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype), yn = class yn {
				constructor(t, r) {
					this._ongoingPromise = void 0, this._isFinished = false, this._reader = t, this._preventCancel = r;
				}
				next() {
					const t = n$1(() => this._nextSteps(), "nextSteps");
					return this._ongoingPromise = this._ongoingPromise ? F(this._ongoingPromise, t, t) : t(), this._ongoingPromise;
				}
				return(t) {
					const r = n$1(() => this._returnSteps(t), "returnSteps");
					return this._ongoingPromise ? F(this._ongoingPromise, r, r) : r();
				}
				_nextSteps() {
					if (this._isFinished) return Promise.resolve({
						value: void 0,
						done: true
					});
					const t = this._reader;
					let r, s;
					const u = A((d, m) => {
						r = d, s = m;
					});
					return _t(t, {
						_chunkSteps: n$1((d) => {
							this._ongoingPromise = void 0, ge(() => r({
								value: d,
								done: false
							}));
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							this._ongoingPromise = void 0, this._isFinished = true, _e(t), r({
								value: void 0,
								done: true
							});
						}, "_closeSteps"),
						_errorSteps: n$1((d) => {
							this._ongoingPromise = void 0, this._isFinished = true, _e(t), s(d);
						}, "_errorSteps")
					}), u;
				}
				_returnSteps(t) {
					if (this._isFinished) return Promise.resolve({
						value: t,
						done: true
					});
					this._isFinished = true;
					const r = this._reader;
					if (!this._preventCancel) {
						const s = Wr(r, t);
						return _e(r), F(s, () => ({
							value: t,
							done: true
						}));
					}
					return _e(r), T({
						value: t,
						done: true
					});
				}
			};
			n$1(yn, "ReadableStreamAsyncIteratorImpl");
			let Mt = yn;
			const no = {
				next() {
					return oo(this) ? this._asyncIteratorImpl.next() : b(io("next"));
				},
				return(e) {
					return oo(this) ? this._asyncIteratorImpl.return(e) : b(io("return"));
				}
			};
			Object.setPrototypeOf(no, Zi);
			function Ki(e, t) {
				const r = Qe(e), s = new Mt(r, t), u = Object.create(no);
				return u._asyncIteratorImpl = s, u;
			}
			n$1(Ki, "AcquireReadableStreamAsyncIterator");
			function oo(e) {
				if (!l(e) || !Object.prototype.hasOwnProperty.call(e, "_asyncIteratorImpl")) return false;
				try {
					return e._asyncIteratorImpl instanceof Mt;
				} catch {
					return false;
				}
			}
			n$1(oo, "IsReadableStreamAsyncIterator");
			function io(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`);
			}
			n$1(io, "streamAsyncIteratorBrandCheckException");
			const ao = Number.isNaN || function(e) {
				return e !== e;
			};
			var $r, Dr, Mr;
			function St(e) {
				return e.slice();
			}
			n$1(St, "CreateArrayFromList");
			function so(e, t, r, s, u) {
				new Uint8Array(e).set(new Uint8Array(r, s, u), t);
			}
			n$1(so, "CopyDataBlockBytes");
			let we = n$1((e) => (typeof e.transfer == "function" ? we = n$1((t) => t.transfer(), "TransferArrayBuffer") : typeof structuredClone == "function" ? we = n$1((t) => structuredClone(t, { transfer: [t] }), "TransferArrayBuffer") : we = n$1((t) => t, "TransferArrayBuffer"), we(e)), "TransferArrayBuffer"), Ae = n$1((e) => (typeof e.detached == "boolean" ? Ae = n$1((t) => t.detached, "IsDetachedBuffer") : Ae = n$1((t) => t.byteLength === 0, "IsDetachedBuffer"), Ae(e)), "IsDetachedBuffer");
			function lo(e, t, r) {
				if (e.slice) return e.slice(t, r);
				const s = r - t, u = new ArrayBuffer(s);
				return so(u, 0, e, t, s), u;
			}
			n$1(lo, "ArrayBufferSlice");
			function Ut(e, t) {
				const r = e[t];
				if (r != null) {
					if (typeof r != "function") throw new TypeError(`${String(t)} is not a function`);
					return r;
				}
			}
			n$1(Ut, "GetMethod");
			function Ji(e) {
				const t = { [Symbol.iterator]: () => e.iterator }, r = async function* () {
					return yield* t;
				}();
				return {
					iterator: r,
					nextMethod: r.next,
					done: false
				};
			}
			n$1(Ji, "CreateAsyncFromSyncIterator");
			const Ur = (Mr = ($r = Symbol.asyncIterator) !== null && $r !== void 0 ? $r : (Dr = Symbol.for) === null || Dr === void 0 ? void 0 : Dr.call(Symbol, "Symbol.asyncIterator")) !== null && Mr !== void 0 ? Mr : "@@asyncIterator";
			function uo(e, t = "sync", r) {
				if (r === void 0) if (t === "async") {
					if (r = Ut(e, Ur), r === void 0) return Ji(uo(e, "sync", Ut(e, Symbol.iterator)));
				} else r = Ut(e, Symbol.iterator);
				if (r === void 0) throw new TypeError("The object is not iterable");
				const s = z(r, e, []);
				if (!l(s)) throw new TypeError("The iterator method must return an object");
				return {
					iterator: s,
					nextMethod: s.next,
					done: false
				};
			}
			n$1(uo, "GetIterator");
			function Xi(e) {
				const t = z(e.nextMethod, e.iterator, []);
				if (!l(t)) throw new TypeError("The iterator.next() method must return an object");
				return t;
			}
			n$1(Xi, "IteratorNext");
			function ea(e) {
				return !!e.done;
			}
			n$1(ea, "IteratorComplete");
			function ta(e) {
				return e.value;
			}
			n$1(ta, "IteratorValue");
			function ra(e) {
				return !(typeof e != "number" || ao(e) || e < 0);
			}
			n$1(ra, "IsNonNegativeNumber");
			function fo(e) {
				const t = lo(e.buffer, e.byteOffset, e.byteOffset + e.byteLength);
				return new Uint8Array(t);
			}
			n$1(fo, "CloneAsUint8Array");
			function xr(e) {
				const t = e._queue.shift();
				return e._queueTotalSize -= t.size, e._queueTotalSize < 0 && (e._queueTotalSize = 0), t.value;
			}
			n$1(xr, "DequeueValue");
			function Nr(e, t, r) {
				if (!ra(r) || r === 1 / 0) throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
				e._queue.push({
					value: t,
					size: r
				}), e._queueTotalSize += r;
			}
			n$1(Nr, "EnqueueValueWithSize");
			function na(e) {
				return e._queue.peek().value;
			}
			n$1(na, "PeekQueueValue");
			function Be(e) {
				e._queue = new D(), e._queueTotalSize = 0;
			}
			n$1(Be, "ResetQueue");
			function co(e) {
				return e === DataView;
			}
			n$1(co, "isDataViewConstructor");
			function oa(e) {
				return co(e.constructor);
			}
			n$1(oa, "isDataView");
			function ia(e) {
				return co(e) ? 1 : e.BYTES_PER_ELEMENT;
			}
			n$1(ia, "arrayBufferViewElementSize");
			const gn = class gn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get view() {
					if (!Hr(this)) throw Zr("view");
					return this._view;
				}
				respond(t) {
					if (!Hr(this)) throw Zr("respond");
					if (Se(t, 1, "respond"), t = Fr(t, "First parameter"), this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
					if (Ae(this._view.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");
					Vt(this._associatedReadableByteStreamController, t);
				}
				respondWithNewView(t) {
					if (!Hr(this)) throw Zr("respondWithNewView");
					if (Se(t, 1, "respondWithNewView"), !ArrayBuffer.isView(t)) throw new TypeError("You can only respond with array buffer views");
					if (this._associatedReadableByteStreamController === void 0) throw new TypeError("This BYOB request has been invalidated");
					if (Ae(t.buffer)) throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");
					Qt(this._associatedReadableByteStreamController, t);
				}
			};
			n$1(gn, "ReadableStreamBYOBRequest");
			let Re = gn;
			Object.defineProperties(Re.prototype, {
				respond: { enumerable: true },
				respondWithNewView: { enumerable: true },
				view: { enumerable: true }
			}), h(Re.prototype.respond, "respond"), h(Re.prototype.respondWithNewView, "respondWithNewView"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Re.prototype, Symbol.toStringTag, {
				value: "ReadableStreamBYOBRequest",
				configurable: true
			});
			const _n = class _n {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get byobRequest() {
					if (!Ie(this)) throw Rt("byobRequest");
					return Gr(this);
				}
				get desiredSize() {
					if (!Ie(this)) throw Rt("desiredSize");
					return Ro(this);
				}
				close() {
					if (!Ie(this)) throw Rt("close");
					if (this._closeRequested) throw new TypeError("The stream has already been closed; do not close it again!");
					const t = this._controlledReadableByteStream._state;
					if (t !== "readable") throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);
					wt(this);
				}
				enqueue(t) {
					if (!Ie(this)) throw Rt("enqueue");
					if (Se(t, 1, "enqueue"), !ArrayBuffer.isView(t)) throw new TypeError("chunk must be an array buffer view");
					if (t.byteLength === 0) throw new TypeError("chunk must have non-zero byteLength");
					if (t.buffer.byteLength === 0) throw new TypeError("chunk's buffer must have non-zero byteLength");
					if (this._closeRequested) throw new TypeError("stream is closed or draining");
					const r = this._controlledReadableByteStream._state;
					if (r !== "readable") throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);
					Ht(this, t);
				}
				error(t = void 0) {
					if (!Ie(this)) throw Rt("error");
					K(this, t);
				}
				[Ar](t) {
					ho(this), Be(this);
					const r = this._cancelAlgorithm(t);
					return Nt(this), r;
				}
				[Br](t) {
					const r = this._controlledReadableByteStream;
					if (this._queueTotalSize > 0) {
						wo(this, t);
						return;
					}
					const s = this._autoAllocateChunkSize;
					if (s !== void 0) {
						let u;
						try {
							u = new ArrayBuffer(s);
						} catch (d) {
							t._errorSteps(d);
							return;
						}
						const c = {
							buffer: u,
							bufferByteLength: s,
							byteOffset: 0,
							byteLength: s,
							bytesFilled: 0,
							minimumFill: 1,
							elementSize: 1,
							viewConstructor: Uint8Array,
							readerType: "default"
						};
						this._pendingPullIntos.push(c);
					}
					eo(r, t), Fe(this);
				}
				[kr]() {
					if (this._pendingPullIntos.length > 0) {
						const t = this._pendingPullIntos.peek();
						t.readerType = "none", this._pendingPullIntos = new D(), this._pendingPullIntos.push(t);
					}
				}
			};
			n$1(_n, "ReadableByteStreamController");
			let te = _n;
			Object.defineProperties(te.prototype, {
				close: { enumerable: true },
				enqueue: { enumerable: true },
				error: { enumerable: true },
				byobRequest: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(te.prototype.close, "close"), h(te.prototype.enqueue, "enqueue"), h(te.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(te.prototype, Symbol.toStringTag, {
				value: "ReadableByteStreamController",
				configurable: true
			});
			function Ie(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableByteStream") ? false : e instanceof te;
			}
			n$1(Ie, "IsReadableByteStreamController");
			function Hr(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_associatedReadableByteStreamController") ? false : e instanceof Re;
			}
			n$1(Hr, "IsReadableStreamBYOBRequest");
			function Fe(e) {
				if (!fa(e)) return;
				if (e._pulling) {
					e._pullAgain = true;
					return;
				}
				e._pulling = true;
				g(e._pullAlgorithm(), () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, Fe(e)), null), (s) => (K(e, s), null));
			}
			n$1(Fe, "ReadableByteStreamControllerCallPullIfNeeded");
			function ho(e) {
				Qr(e), e._pendingPullIntos = new D();
			}
			n$1(ho, "ReadableByteStreamControllerClearPendingPullIntos");
			function Vr(e, t) {
				let r = false;
				e._state === "closed" && (r = true);
				const s = po(t);
				t.readerType === "default" ? Lr(e, s, r) : ma(e, s, r);
			}
			n$1(Vr, "ReadableByteStreamControllerCommitPullIntoDescriptor");
			function po(e) {
				const t = e.bytesFilled, r = e.elementSize;
				return new e.viewConstructor(e.buffer, e.byteOffset, t / r);
			}
			n$1(po, "ReadableByteStreamControllerConvertPullIntoDescriptor");
			function xt(e, t, r, s) {
				e._queue.push({
					buffer: t,
					byteOffset: r,
					byteLength: s
				}), e._queueTotalSize += s;
			}
			n$1(xt, "ReadableByteStreamControllerEnqueueChunkToQueue");
			function bo(e, t, r, s) {
				let u;
				try {
					u = lo(t, r, r + s);
				} catch (c) {
					throw K(e, c), c;
				}
				xt(e, u, 0, s);
			}
			n$1(bo, "ReadableByteStreamControllerEnqueueClonedChunkToQueue");
			function mo(e, t) {
				t.bytesFilled > 0 && bo(e, t.buffer, t.byteOffset, t.bytesFilled), Ye(e);
			}
			n$1(mo, "ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");
			function yo(e, t) {
				const r = Math.min(e._queueTotalSize, t.byteLength - t.bytesFilled), s = t.bytesFilled + r;
				let u = r, c = false;
				const m = s - s % t.elementSize;
				m >= t.minimumFill && (u = m - t.bytesFilled, c = true);
				const R = e._queue;
				for (; u > 0;) {
					const y = R.peek(), C = Math.min(u, y.byteLength), P = t.byteOffset + t.bytesFilled;
					so(t.buffer, P, y.buffer, y.byteOffset, C), y.byteLength === C ? R.shift() : (y.byteOffset += C, y.byteLength -= C), e._queueTotalSize -= C, go(e, C, t), u -= C;
				}
				return c;
			}
			n$1(yo, "ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");
			function go(e, t, r) {
				r.bytesFilled += t;
			}
			n$1(go, "ReadableByteStreamControllerFillHeadPullIntoDescriptor");
			function _o(e) {
				e._queueTotalSize === 0 && e._closeRequested ? (Nt(e), At(e._controlledReadableByteStream)) : Fe(e);
			}
			n$1(_o, "ReadableByteStreamControllerHandleQueueDrain");
			function Qr(e) {
				e._byobRequest !== null && (e._byobRequest._associatedReadableByteStreamController = void 0, e._byobRequest._view = null, e._byobRequest = null);
			}
			n$1(Qr, "ReadableByteStreamControllerInvalidateBYOBRequest");
			function Yr(e) {
				for (; e._pendingPullIntos.length > 0;) {
					if (e._queueTotalSize === 0) return;
					const t = e._pendingPullIntos.peek();
					yo(e, t) && (Ye(e), Vr(e._controlledReadableByteStream, t));
				}
			}
			n$1(Yr, "ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");
			function aa(e) {
				const t = e._controlledReadableByteStream._reader;
				for (; t._readRequests.length > 0;) {
					if (e._queueTotalSize === 0) return;
					wo(e, t._readRequests.shift());
				}
			}
			n$1(aa, "ReadableByteStreamControllerProcessReadRequestsUsingQueue");
			function sa(e, t, r, s) {
				const u = e._controlledReadableByteStream, c = t.constructor, d = ia(c), { byteOffset: m, byteLength: R } = t, y = r * d;
				let C;
				try {
					C = we(t.buffer);
				} catch (B) {
					s._errorSteps(B);
					return;
				}
				const P = {
					buffer: C,
					bufferByteLength: C.byteLength,
					byteOffset: m,
					byteLength: R,
					bytesFilled: 0,
					minimumFill: y,
					elementSize: d,
					viewConstructor: c,
					readerType: "byob"
				};
				if (e._pendingPullIntos.length > 0) {
					e._pendingPullIntos.push(P), Po(u, s);
					return;
				}
				if (u._state === "closed") {
					const B = new c(P.buffer, P.byteOffset, 0);
					s._closeSteps(B);
					return;
				}
				if (e._queueTotalSize > 0) {
					if (yo(e, P)) {
						const B = po(P);
						_o(e), s._chunkSteps(B);
						return;
					}
					if (e._closeRequested) {
						const B = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
						K(e, B), s._errorSteps(B);
						return;
					}
				}
				e._pendingPullIntos.push(P), Po(u, s), Fe(e);
			}
			n$1(sa, "ReadableByteStreamControllerPullInto");
			function la(e, t) {
				t.readerType === "none" && Ye(e);
				const r = e._controlledReadableByteStream;
				if (Kr(r)) for (; vo(r) > 0;) Vr(r, Ye(e));
			}
			n$1(la, "ReadableByteStreamControllerRespondInClosedState");
			function ua(e, t, r) {
				if (go(e, t, r), r.readerType === "none") {
					mo(e, r), Yr(e);
					return;
				}
				if (r.bytesFilled < r.minimumFill) return;
				Ye(e);
				const s = r.bytesFilled % r.elementSize;
				if (s > 0) {
					const u = r.byteOffset + r.bytesFilled;
					bo(e, r.buffer, u - s, s);
				}
				r.bytesFilled -= s, Vr(e._controlledReadableByteStream, r), Yr(e);
			}
			n$1(ua, "ReadableByteStreamControllerRespondInReadableState");
			function So(e, t) {
				const r = e._pendingPullIntos.peek();
				Qr(e), e._controlledReadableByteStream._state === "closed" ? la(e, r) : ua(e, t, r), Fe(e);
			}
			n$1(So, "ReadableByteStreamControllerRespondInternal");
			function Ye(e) {
				return e._pendingPullIntos.shift();
			}
			n$1(Ye, "ReadableByteStreamControllerShiftPendingPullInto");
			function fa(e) {
				const t = e._controlledReadableByteStream;
				return t._state !== "readable" || e._closeRequested || !e._started ? false : !!(to(t) && $t(t) > 0 || Kr(t) && vo(t) > 0 || Ro(e) > 0);
			}
			n$1(fa, "ReadableByteStreamControllerShouldCallPull");
			function Nt(e) {
				e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0;
			}
			n$1(Nt, "ReadableByteStreamControllerClearAlgorithms");
			function wt(e) {
				const t = e._controlledReadableByteStream;
				if (!(e._closeRequested || t._state !== "readable")) {
					if (e._queueTotalSize > 0) {
						e._closeRequested = true;
						return;
					}
					if (e._pendingPullIntos.length > 0) {
						const r = e._pendingPullIntos.peek();
						if (r.bytesFilled % r.elementSize !== 0) {
							const s = /* @__PURE__ */ new TypeError("Insufficient bytes to fill elements in the given buffer");
							throw K(e, s), s;
						}
					}
					Nt(e), At(t);
				}
			}
			n$1(wt, "ReadableByteStreamControllerClose");
			function Ht(e, t) {
				const r = e._controlledReadableByteStream;
				if (e._closeRequested || r._state !== "readable") return;
				const { buffer: s, byteOffset: u, byteLength: c } = t;
				if (Ae(s)) throw new TypeError("chunk's buffer is detached and so cannot be enqueued");
				const d = we(s);
				if (e._pendingPullIntos.length > 0) {
					const m = e._pendingPullIntos.peek();
					if (Ae(m.buffer)) throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");
					Qr(e), m.buffer = we(m.buffer), m.readerType === "none" && mo(e, m);
				}
				if (to(r)) if (aa(e), $t(r) === 0) xt(e, d, u, c);
				else {
					e._pendingPullIntos.length > 0 && Ye(e);
					Lr(r, new Uint8Array(d, u, c), false);
				}
				else Kr(r) ? (xt(e, d, u, c), Yr(e)) : xt(e, d, u, c);
				Fe(e);
			}
			n$1(Ht, "ReadableByteStreamControllerEnqueue");
			function K(e, t) {
				const r = e._controlledReadableByteStream;
				r._state === "readable" && (ho(e), Be(e), Nt(e), Zo(r, t));
			}
			n$1(K, "ReadableByteStreamControllerError");
			function wo(e, t) {
				const r = e._queue.shift();
				e._queueTotalSize -= r.byteLength, _o(e);
				const s = new Uint8Array(r.buffer, r.byteOffset, r.byteLength);
				t._chunkSteps(s);
			}
			n$1(wo, "ReadableByteStreamControllerFillReadRequestFromQueue");
			function Gr(e) {
				if (e._byobRequest === null && e._pendingPullIntos.length > 0) {
					const t = e._pendingPullIntos.peek(), r = new Uint8Array(t.buffer, t.byteOffset + t.bytesFilled, t.byteLength - t.bytesFilled), s = Object.create(Re.prototype);
					da(s, e, r), e._byobRequest = s;
				}
				return e._byobRequest;
			}
			n$1(Gr, "ReadableByteStreamControllerGetBYOBRequest");
			function Ro(e) {
				const t = e._controlledReadableByteStream._state;
				return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
			}
			n$1(Ro, "ReadableByteStreamControllerGetDesiredSize");
			function Vt(e, t) {
				const r = e._pendingPullIntos.peek();
				if (e._controlledReadableByteStream._state === "closed") {
					if (t !== 0) throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
				} else {
					if (t === 0) throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
					if (r.bytesFilled + t > r.byteLength) throw new RangeError("bytesWritten out of range");
				}
				r.buffer = we(r.buffer), So(e, t);
			}
			n$1(Vt, "ReadableByteStreamControllerRespond");
			function Qt(e, t) {
				const r = e._pendingPullIntos.peek();
				if (e._controlledReadableByteStream._state === "closed") {
					if (t.byteLength !== 0) throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
				} else if (t.byteLength === 0) throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
				if (r.byteOffset + r.bytesFilled !== t.byteOffset) throw new RangeError("The region specified by view does not match byobRequest");
				if (r.bufferByteLength !== t.buffer.byteLength) throw new RangeError("The buffer of view has different capacity than byobRequest");
				if (r.bytesFilled + t.byteLength > r.byteLength) throw new RangeError("The region specified by view is larger than byobRequest");
				const u = t.byteLength;
				r.buffer = we(t.buffer), So(e, u);
			}
			n$1(Qt, "ReadableByteStreamControllerRespondWithNewView");
			function To(e, t, r, s, u, c, d) {
				t._controlledReadableByteStream = e, t._pullAgain = false, t._pulling = false, t._byobRequest = null, t._queue = t._queueTotalSize = void 0, Be(t), t._closeRequested = false, t._started = false, t._strategyHWM = c, t._pullAlgorithm = s, t._cancelAlgorithm = u, t._autoAllocateChunkSize = d, t._pendingPullIntos = new D(), e._readableStreamController = t;
				g(T(r()), () => (t._started = true, Fe(t), null), (R) => (K(t, R), null));
			}
			n$1(To, "SetUpReadableByteStreamController");
			function ca(e, t, r) {
				const s = Object.create(te.prototype);
				let u, c, d;
				t.start !== void 0 ? u = n$1(() => t.start(s), "startAlgorithm") : u = n$1(() => {}, "startAlgorithm"), t.pull !== void 0 ? c = n$1(() => t.pull(s), "pullAlgorithm") : c = n$1(() => T(void 0), "pullAlgorithm"), t.cancel !== void 0 ? d = n$1((R) => t.cancel(R), "cancelAlgorithm") : d = n$1(() => T(void 0), "cancelAlgorithm");
				const m = t.autoAllocateChunkSize;
				if (m === 0) throw new TypeError("autoAllocateChunkSize must be greater than 0");
				To(e, s, u, c, d, r, m);
			}
			n$1(ca, "SetUpReadableByteStreamControllerFromUnderlyingSource");
			function da(e, t, r) {
				e._associatedReadableByteStreamController = t, e._view = r;
			}
			n$1(da, "SetUpReadableStreamBYOBRequest");
			function Zr(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`);
			}
			n$1(Zr, "byobRequestBrandCheckException");
			function Rt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`);
			}
			n$1(Rt, "byteStreamControllerBrandCheckException");
			function ha(e, t) {
				ue(e, t);
				const r = e?.mode;
				return { mode: r === void 0 ? void 0 : pa(r, `${t} has member 'mode' that`) };
			}
			n$1(ha, "convertReaderOptions");
			function pa(e, t) {
				if (e = `${e}`, e !== "byob") throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);
				return e;
			}
			n$1(pa, "convertReadableStreamReaderMode");
			function ba(e, t) {
				var r;
				ue(e, t);
				return { min: Fr((r = e?.min) !== null && r !== void 0 ? r : 1, `${t} has member 'min' that`) };
			}
			n$1(ba, "convertByobReadOptions");
			function Co(e) {
				return new ce(e);
			}
			n$1(Co, "AcquireReadableStreamBYOBReader");
			function Po(e, t) {
				e._reader._readIntoRequests.push(t);
			}
			n$1(Po, "ReadableStreamAddReadIntoRequest");
			function ma(e, t, r) {
				const u = e._reader._readIntoRequests.shift();
				r ? u._closeSteps(t) : u._chunkSteps(t);
			}
			n$1(ma, "ReadableStreamFulfillReadIntoRequest");
			function vo(e) {
				return e._reader._readIntoRequests.length;
			}
			n$1(vo, "ReadableStreamGetNumReadIntoRequests");
			function Kr(e) {
				const t = e._reader;
				return !(t === void 0 || !je(t));
			}
			n$1(Kr, "ReadableStreamHasBYOBReader");
			const Sn = class Sn {
				constructor(t) {
					if (Se(t, 1, "ReadableStreamBYOBReader"), jr(t, "First parameter"), qe(t)) throw new TypeError("This stream has already been locked for exclusive reading by another reader");
					if (!Ie(t._readableStreamController)) throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
					Yn(this, t), this._readIntoRequests = new D();
				}
				get closed() {
					return je(this) ? this._closedPromise : b(Yt("closed"));
				}
				cancel(t = void 0) {
					return je(this) ? this._ownerReadableStream === void 0 ? b(Lt("cancel")) : Wr(this, t) : b(Yt("cancel"));
				}
				read(t, r = {}) {
					if (!je(this)) return b(Yt("read"));
					if (!ArrayBuffer.isView(t)) return b(/* @__PURE__ */ new TypeError("view must be an array buffer view"));
					if (t.byteLength === 0) return b(/* @__PURE__ */ new TypeError("view must have non-zero byteLength"));
					if (t.buffer.byteLength === 0) return b(/* @__PURE__ */ new TypeError("view's buffer must have non-zero byteLength"));
					if (Ae(t.buffer)) return b(/* @__PURE__ */ new TypeError("view's buffer has been detached"));
					let s;
					try {
						s = ba(r, "options");
					} catch (y) {
						return b(y);
					}
					const u = s.min;
					if (u === 0) return b(/* @__PURE__ */ new TypeError("options.min must be greater than 0"));
					if (oa(t)) {
						if (u > t.byteLength) return b(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's byteLength"));
					} else if (u > t.length) return b(/* @__PURE__ */ new RangeError("options.min must be less than or equal to view's length"));
					if (this._ownerReadableStream === void 0) return b(Lt("read from"));
					let c, d;
					const m = A((y, C) => {
						c = y, d = C;
					});
					return Eo(this, t, u, {
						_chunkSteps: n$1((y) => c({
							value: y,
							done: false
						}), "_chunkSteps"),
						_closeSteps: n$1((y) => c({
							value: y,
							done: true
						}), "_closeSteps"),
						_errorSteps: n$1((y) => d(y), "_errorSteps")
					}), m;
				}
				releaseLock() {
					if (!je(this)) throw Yt("releaseLock");
					this._ownerReadableStream !== void 0 && ya(this);
				}
			};
			n$1(Sn, "ReadableStreamBYOBReader");
			let ce = Sn;
			Object.defineProperties(ce.prototype, {
				cancel: { enumerable: true },
				read: { enumerable: true },
				releaseLock: { enumerable: true },
				closed: { enumerable: true }
			}), h(ce.prototype.cancel, "cancel"), h(ce.prototype.read, "read"), h(ce.prototype.releaseLock, "releaseLock"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ce.prototype, Symbol.toStringTag, {
				value: "ReadableStreamBYOBReader",
				configurable: true
			});
			function je(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readIntoRequests") ? false : e instanceof ce;
			}
			n$1(je, "IsReadableStreamBYOBReader");
			function Eo(e, t, r, s) {
				const u = e._ownerReadableStream;
				u._disturbed = true, u._state === "errored" ? s._errorSteps(u._storedError) : sa(u._readableStreamController, t, r, s);
			}
			n$1(Eo, "ReadableStreamBYOBReaderRead");
			function ya(e) {
				_e(e);
				Ao(e, /* @__PURE__ */ new TypeError("Reader was released"));
			}
			n$1(ya, "ReadableStreamBYOBReaderRelease");
			function Ao(e, t) {
				const r = e._readIntoRequests;
				e._readIntoRequests = new D(), r.forEach((s) => {
					s._errorSteps(t);
				});
			}
			n$1(Ao, "ReadableStreamBYOBReaderErrorReadIntoRequests");
			function Yt(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`);
			}
			n$1(Yt, "byobReaderBrandCheckException");
			function Tt(e, t) {
				const { highWaterMark: r } = e;
				if (r === void 0) return t;
				if (ao(r) || r < 0) throw new RangeError("Invalid highWaterMark");
				return r;
			}
			n$1(Tt, "ExtractHighWaterMark");
			function Gt(e) {
				const { size: t } = e;
				return t || (() => 1);
			}
			n$1(Gt, "ExtractSizeAlgorithm");
			function Zt(e, t) {
				ue(e, t);
				const r = e?.highWaterMark, s = e?.size;
				return {
					highWaterMark: r === void 0 ? void 0 : Ir(r),
					size: s === void 0 ? void 0 : ga(s, `${t} has member 'size' that`)
				};
			}
			n$1(Zt, "convertQueuingStrategy");
			function ga(e, t) {
				return Z(e, t), (r) => Ir(e(r));
			}
			n$1(ga, "convertQueuingStrategySize");
			function _a(e, t) {
				ue(e, t);
				const r = e?.abort, s = e?.close, u = e?.start, c = e?.type, d = e?.write;
				return {
					abort: r === void 0 ? void 0 : Sa(r, e, `${t} has member 'abort' that`),
					close: s === void 0 ? void 0 : wa(s, e, `${t} has member 'close' that`),
					start: u === void 0 ? void 0 : Ra(u, e, `${t} has member 'start' that`),
					write: d === void 0 ? void 0 : Ta(d, e, `${t} has member 'write' that`),
					type: c
				};
			}
			n$1(_a, "convertUnderlyingSink");
			function Sa(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(Sa, "convertUnderlyingSinkAbortCallback");
			function wa(e, t, r) {
				return Z(e, r), () => j(e, t, []);
			}
			n$1(wa, "convertUnderlyingSinkCloseCallback");
			function Ra(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(Ra, "convertUnderlyingSinkStartCallback");
			function Ta(e, t, r) {
				return Z(e, r), (s, u) => j(e, t, [s, u]);
			}
			n$1(Ta, "convertUnderlyingSinkWriteCallback");
			function Bo(e, t) {
				if (!Ge(e)) throw new TypeError(`${t} is not a WritableStream.`);
			}
			n$1(Bo, "assertWritableStream");
			function Ca(e) {
				if (typeof e != "object" || e === null) return false;
				try {
					return typeof e.aborted == "boolean";
				} catch {
					return false;
				}
			}
			n$1(Ca, "isAbortSignal");
			const Pa = typeof AbortController == "function";
			function va() {
				if (Pa) return new AbortController();
			}
			n$1(va, "createAbortController");
			const wn = class wn {
				constructor(t = {}, r = {}) {
					t === void 0 ? t = null : Jn(t, "First parameter");
					const s = Zt(r, "Second parameter"), u = _a(t, "First parameter");
					if (Wo(this), u.type !== void 0) throw new RangeError("Invalid type is specified");
					const d = Gt(s), m = Tt(s, 1);
					Da(this, u, m, d);
				}
				get locked() {
					if (!Ge(this)) throw tr("locked");
					return Ze(this);
				}
				abort(t = void 0) {
					return Ge(this) ? Ze(this) ? b(/* @__PURE__ */ new TypeError("Cannot abort a stream that already has a writer")) : Kt(this, t) : b(tr("abort"));
				}
				close() {
					return Ge(this) ? Ze(this) ? b(/* @__PURE__ */ new TypeError("Cannot close a stream that already has a writer")) : he(this) ? b(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream")) : qo(this) : b(tr("close"));
				}
				getWriter() {
					if (!Ge(this)) throw tr("getWriter");
					return ko(this);
				}
			};
			n$1(wn, "WritableStream");
			let de = wn;
			Object.defineProperties(de.prototype, {
				abort: { enumerable: true },
				close: { enumerable: true },
				getWriter: { enumerable: true },
				locked: { enumerable: true }
			}), h(de.prototype.abort, "abort"), h(de.prototype.close, "close"), h(de.prototype.getWriter, "getWriter"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(de.prototype, Symbol.toStringTag, {
				value: "WritableStream",
				configurable: true
			});
			function ko(e) {
				return new re(e);
			}
			n$1(ko, "AcquireWritableStreamDefaultWriter");
			function Ea(e, t, r, s, u = 1, c = () => 1) {
				const d = Object.create(de.prototype);
				Wo(d);
				return Lo(d, Object.create(ke.prototype), e, t, r, s, u, c), d;
			}
			n$1(Ea, "CreateWritableStream");
			function Wo(e) {
				e._state = "writable", e._storedError = void 0, e._writer = void 0, e._writableStreamController = void 0, e._writeRequests = new D(), e._inFlightWriteRequest = void 0, e._closeRequest = void 0, e._inFlightCloseRequest = void 0, e._pendingAbortRequest = void 0, e._backpressure = false;
			}
			n$1(Wo, "InitializeWritableStream");
			function Ge(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_writableStreamController") ? false : e instanceof de;
			}
			n$1(Ge, "IsWritableStream");
			function Ze(e) {
				return e._writer !== void 0;
			}
			n$1(Ze, "IsWritableStreamLocked");
			function Kt(e, t) {
				var r;
				if (e._state === "closed" || e._state === "errored") return T(void 0);
				e._writableStreamController._abortReason = t, (r = e._writableStreamController._abortController) === null || r === void 0 || r.abort(t);
				const s = e._state;
				if (s === "closed" || s === "errored") return T(void 0);
				if (e._pendingAbortRequest !== void 0) return e._pendingAbortRequest._promise;
				let u = false;
				s === "erroring" && (u = true, t = void 0);
				const c = A((d, m) => {
					e._pendingAbortRequest = {
						_promise: void 0,
						_resolve: d,
						_reject: m,
						_reason: t,
						_wasAlreadyErroring: u
					};
				});
				return e._pendingAbortRequest._promise = c, u || Xr(e, t), c;
			}
			n$1(Kt, "WritableStreamAbort");
			function qo(e) {
				const t = e._state;
				if (t === "closed" || t === "errored") return b(/* @__PURE__ */ new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));
				const r = A((u, c) => {
					e._closeRequest = {
						_resolve: u,
						_reject: c
					};
				}), s = e._writer;
				return s !== void 0 && e._backpressure && t === "writable" && ln(s), Ma(e._writableStreamController), r;
			}
			n$1(qo, "WritableStreamClose");
			function Aa(e) {
				return A((r, s) => {
					const u = {
						_resolve: r,
						_reject: s
					};
					e._writeRequests.push(u);
				});
			}
			n$1(Aa, "WritableStreamAddWriteRequest");
			function Jr(e, t) {
				if (e._state === "writable") {
					Xr(e, t);
					return;
				}
				en(e);
			}
			n$1(Jr, "WritableStreamDealWithRejection");
			function Xr(e, t) {
				const r = e._writableStreamController;
				e._state = "erroring", e._storedError = t;
				const s = e._writer;
				s !== void 0 && zo(s, t), !Oa(e) && r._started && en(e);
			}
			n$1(Xr, "WritableStreamStartErroring");
			function en(e) {
				e._state = "errored", e._writableStreamController[Qn]();
				const t = e._storedError;
				if (e._writeRequests.forEach((u) => {
					u._reject(t);
				}), e._writeRequests = new D(), e._pendingAbortRequest === void 0) {
					Jt(e);
					return;
				}
				const r = e._pendingAbortRequest;
				if (e._pendingAbortRequest = void 0, r._wasAlreadyErroring) {
					r._reject(t), Jt(e);
					return;
				}
				g(e._writableStreamController[jt](r._reason), () => (r._resolve(), Jt(e), null), (u) => (r._reject(u), Jt(e), null));
			}
			n$1(en, "WritableStreamFinishErroring");
			function Ba(e) {
				e._inFlightWriteRequest._resolve(void 0), e._inFlightWriteRequest = void 0;
			}
			n$1(Ba, "WritableStreamFinishInFlightWrite");
			function ka(e, t) {
				e._inFlightWriteRequest._reject(t), e._inFlightWriteRequest = void 0, Jr(e, t);
			}
			n$1(ka, "WritableStreamFinishInFlightWriteWithError");
			function Wa(e) {
				e._inFlightCloseRequest._resolve(void 0), e._inFlightCloseRequest = void 0, e._state === "erroring" && (e._storedError = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._resolve(), e._pendingAbortRequest = void 0)), e._state = "closed";
				const r = e._writer;
				r !== void 0 && Uo(r);
			}
			n$1(Wa, "WritableStreamFinishInFlightClose");
			function qa(e, t) {
				e._inFlightCloseRequest._reject(t), e._inFlightCloseRequest = void 0, e._pendingAbortRequest !== void 0 && (e._pendingAbortRequest._reject(t), e._pendingAbortRequest = void 0), Jr(e, t);
			}
			n$1(qa, "WritableStreamFinishInFlightCloseWithError");
			function he(e) {
				return !(e._closeRequest === void 0 && e._inFlightCloseRequest === void 0);
			}
			n$1(he, "WritableStreamCloseQueuedOrInFlight");
			function Oa(e) {
				return !(e._inFlightWriteRequest === void 0 && e._inFlightCloseRequest === void 0);
			}
			n$1(Oa, "WritableStreamHasOperationMarkedInFlight");
			function za(e) {
				e._inFlightCloseRequest = e._closeRequest, e._closeRequest = void 0;
			}
			n$1(za, "WritableStreamMarkCloseRequestInFlight");
			function Ia(e) {
				e._inFlightWriteRequest = e._writeRequests.shift();
			}
			n$1(Ia, "WritableStreamMarkFirstWriteRequestInFlight");
			function Jt(e) {
				e._closeRequest !== void 0 && (e._closeRequest._reject(e._storedError), e._closeRequest = void 0);
				const t = e._writer;
				t !== void 0 && an(t, e._storedError);
			}
			n$1(Jt, "WritableStreamRejectCloseAndClosedPromiseIfNeeded");
			function tn(e, t) {
				const r = e._writer;
				r !== void 0 && t !== e._backpressure && (t ? Ya(r) : ln(r)), e._backpressure = t;
			}
			n$1(tn, "WritableStreamUpdateBackpressure");
			const Rn = class Rn {
				constructor(t) {
					if (Se(t, 1, "WritableStreamDefaultWriter"), Bo(t, "First parameter"), Ze(t)) throw new TypeError("This stream has already been locked for exclusive writing by another writer");
					this._ownerWritableStream = t, t._writer = this;
					const r = t._state;
					if (r === "writable") !he(t) && t._backpressure ? nr(this) : xo(this), rr(this);
					else if (r === "erroring") sn(this, t._storedError), rr(this);
					else if (r === "closed") xo(this), Va(this);
					else {
						const s = t._storedError;
						sn(this, s), Mo(this, s);
					}
				}
				get closed() {
					return Le(this) ? this._closedPromise : b($e("closed"));
				}
				get desiredSize() {
					if (!Le(this)) throw $e("desiredSize");
					if (this._ownerWritableStream === void 0) throw Pt("desiredSize");
					return $a(this);
				}
				get ready() {
					return Le(this) ? this._readyPromise : b($e("ready"));
				}
				abort(t = void 0) {
					return Le(this) ? this._ownerWritableStream === void 0 ? b(Pt("abort")) : Fa(this, t) : b($e("abort"));
				}
				close() {
					if (!Le(this)) return b($e("close"));
					const t = this._ownerWritableStream;
					return t === void 0 ? b(Pt("close")) : he(t) ? b(/* @__PURE__ */ new TypeError("Cannot close an already-closing stream")) : Oo(this);
				}
				releaseLock() {
					if (!Le(this)) throw $e("releaseLock");
					this._ownerWritableStream !== void 0 && Io(this);
				}
				write(t = void 0) {
					return Le(this) ? this._ownerWritableStream === void 0 ? b(Pt("write to")) : Fo(this, t) : b($e("write"));
				}
			};
			n$1(Rn, "WritableStreamDefaultWriter");
			let re = Rn;
			Object.defineProperties(re.prototype, {
				abort: { enumerable: true },
				close: { enumerable: true },
				releaseLock: { enumerable: true },
				write: { enumerable: true },
				closed: { enumerable: true },
				desiredSize: { enumerable: true },
				ready: { enumerable: true }
			}), h(re.prototype.abort, "abort"), h(re.prototype.close, "close"), h(re.prototype.releaseLock, "releaseLock"), h(re.prototype.write, "write"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(re.prototype, Symbol.toStringTag, {
				value: "WritableStreamDefaultWriter",
				configurable: true
			});
			function Le(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_ownerWritableStream") ? false : e instanceof re;
			}
			n$1(Le, "IsWritableStreamDefaultWriter");
			function Fa(e, t) {
				const r = e._ownerWritableStream;
				return Kt(r, t);
			}
			n$1(Fa, "WritableStreamDefaultWriterAbort");
			function Oo(e) {
				const t = e._ownerWritableStream;
				return qo(t);
			}
			n$1(Oo, "WritableStreamDefaultWriterClose");
			function ja(e) {
				const t = e._ownerWritableStream, r = t._state;
				return he(t) || r === "closed" ? T(void 0) : r === "errored" ? b(t._storedError) : Oo(e);
			}
			n$1(ja, "WritableStreamDefaultWriterCloseWithErrorPropagation");
			function La(e, t) {
				e._closedPromiseState === "pending" ? an(e, t) : Qa(e, t);
			}
			n$1(La, "WritableStreamDefaultWriterEnsureClosedPromiseRejected");
			function zo(e, t) {
				e._readyPromiseState === "pending" ? No(e, t) : Ga(e, t);
			}
			n$1(zo, "WritableStreamDefaultWriterEnsureReadyPromiseRejected");
			function $a(e) {
				const t = e._ownerWritableStream, r = t._state;
				return r === "errored" || r === "erroring" ? null : r === "closed" ? 0 : $o(t._writableStreamController);
			}
			n$1($a, "WritableStreamDefaultWriterGetDesiredSize");
			function Io(e) {
				const t = e._ownerWritableStream, r = /* @__PURE__ */ new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");
				zo(e, r), La(e, r), t._writer = void 0, e._ownerWritableStream = void 0;
			}
			n$1(Io, "WritableStreamDefaultWriterRelease");
			function Fo(e, t) {
				const r = e._ownerWritableStream, s = r._writableStreamController, u = Ua(s, t);
				if (r !== e._ownerWritableStream) return b(Pt("write to"));
				const c = r._state;
				if (c === "errored") return b(r._storedError);
				if (he(r) || c === "closed") return b(/* @__PURE__ */ new TypeError("The stream is closing or closed and cannot be written to"));
				if (c === "erroring") return b(r._storedError);
				const d = Aa(r);
				return xa(s, t, u), d;
			}
			n$1(Fo, "WritableStreamDefaultWriterWrite");
			const jo = {}, Tn = class Tn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get abortReason() {
					if (!rn(this)) throw on("abortReason");
					return this._abortReason;
				}
				get signal() {
					if (!rn(this)) throw on("signal");
					if (this._abortController === void 0) throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
					return this._abortController.signal;
				}
				error(t = void 0) {
					if (!rn(this)) throw on("error");
					this._controlledWritableStream._state === "writable" && Do(this, t);
				}
				[jt](t) {
					const r = this._abortAlgorithm(t);
					return Xt(this), r;
				}
				[Qn]() {
					Be(this);
				}
			};
			n$1(Tn, "WritableStreamDefaultController");
			let ke = Tn;
			Object.defineProperties(ke.prototype, {
				abortReason: { enumerable: true },
				signal: { enumerable: true },
				error: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ke.prototype, Symbol.toStringTag, {
				value: "WritableStreamDefaultController",
				configurable: true
			});
			function rn(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledWritableStream") ? false : e instanceof ke;
			}
			n$1(rn, "IsWritableStreamDefaultController");
			function Lo(e, t, r, s, u, c, d, m) {
				t._controlledWritableStream = e, e._writableStreamController = t, t._queue = void 0, t._queueTotalSize = void 0, Be(t), t._abortReason = void 0, t._abortController = va(), t._started = false, t._strategySizeAlgorithm = m, t._strategyHWM = d, t._writeAlgorithm = s, t._closeAlgorithm = u, t._abortAlgorithm = c;
				tn(e, nn(t));
				g(T(r()), () => (t._started = true, er(t), null), (P) => (t._started = true, Jr(e, P), null));
			}
			n$1(Lo, "SetUpWritableStreamDefaultController");
			function Da(e, t, r, s) {
				const u = Object.create(ke.prototype);
				let c, d, m, R;
				t.start !== void 0 ? c = n$1(() => t.start(u), "startAlgorithm") : c = n$1(() => {}, "startAlgorithm"), t.write !== void 0 ? d = n$1((y) => t.write(y, u), "writeAlgorithm") : d = n$1(() => T(void 0), "writeAlgorithm"), t.close !== void 0 ? m = n$1(() => t.close(), "closeAlgorithm") : m = n$1(() => T(void 0), "closeAlgorithm"), t.abort !== void 0 ? R = n$1((y) => t.abort(y), "abortAlgorithm") : R = n$1(() => T(void 0), "abortAlgorithm"), Lo(e, u, c, d, m, R, r, s);
			}
			n$1(Da, "SetUpWritableStreamDefaultControllerFromUnderlyingSink");
			function Xt(e) {
				e._writeAlgorithm = void 0, e._closeAlgorithm = void 0, e._abortAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
			}
			n$1(Xt, "WritableStreamDefaultControllerClearAlgorithms");
			function Ma(e) {
				Nr(e, jo, 0), er(e);
			}
			n$1(Ma, "WritableStreamDefaultControllerClose");
			function Ua(e, t) {
				try {
					return e._strategySizeAlgorithm(t);
				} catch (r) {
					return Ct(e, r), 1;
				}
			}
			n$1(Ua, "WritableStreamDefaultControllerGetChunkSize");
			function $o(e) {
				return e._strategyHWM - e._queueTotalSize;
			}
			n$1($o, "WritableStreamDefaultControllerGetDesiredSize");
			function xa(e, t, r) {
				try {
					Nr(e, t, r);
				} catch (u) {
					Ct(e, u);
					return;
				}
				const s = e._controlledWritableStream;
				if (!he(s) && s._state === "writable") tn(s, nn(e));
				er(e);
			}
			n$1(xa, "WritableStreamDefaultControllerWrite");
			function er(e) {
				const t = e._controlledWritableStream;
				if (!e._started || t._inFlightWriteRequest !== void 0) return;
				if (t._state === "erroring") {
					en(t);
					return;
				}
				if (e._queue.length === 0) return;
				const s = na(e);
				s === jo ? Na(e) : Ha(e, s);
			}
			n$1(er, "WritableStreamDefaultControllerAdvanceQueueIfNeeded");
			function Ct(e, t) {
				e._controlledWritableStream._state === "writable" && Do(e, t);
			}
			n$1(Ct, "WritableStreamDefaultControllerErrorIfNeeded");
			function Na(e) {
				const t = e._controlledWritableStream;
				za(t), xr(e);
				const r = e._closeAlgorithm();
				Xt(e), g(r, () => (Wa(t), null), (s) => (qa(t, s), null));
			}
			n$1(Na, "WritableStreamDefaultControllerProcessClose");
			function Ha(e, t) {
				const r = e._controlledWritableStream;
				Ia(r);
				g(e._writeAlgorithm(t), () => {
					Ba(r);
					const u = r._state;
					if (xr(e), !he(r) && u === "writable") {
						const c = nn(e);
						tn(r, c);
					}
					return er(e), null;
				}, (u) => (r._state === "writable" && Xt(e), ka(r, u), null));
			}
			n$1(Ha, "WritableStreamDefaultControllerProcessWrite");
			function nn(e) {
				return $o(e) <= 0;
			}
			n$1(nn, "WritableStreamDefaultControllerGetBackpressure");
			function Do(e, t) {
				const r = e._controlledWritableStream;
				Xt(e), Xr(r, t);
			}
			n$1(Do, "WritableStreamDefaultControllerError");
			function tr(e) {
				return /* @__PURE__ */ new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`);
			}
			n$1(tr, "streamBrandCheckException$2");
			function on(e) {
				return /* @__PURE__ */ new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`);
			}
			n$1(on, "defaultControllerBrandCheckException$2");
			function $e(e) {
				return /* @__PURE__ */ new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`);
			}
			n$1($e, "defaultWriterBrandCheckException");
			function Pt(e) {
				return /* @__PURE__ */ new TypeError("Cannot " + e + " a stream using a released writer");
			}
			n$1(Pt, "defaultWriterLockException");
			function rr(e) {
				e._closedPromise = A((t, r) => {
					e._closedPromise_resolve = t, e._closedPromise_reject = r, e._closedPromiseState = "pending";
				});
			}
			n$1(rr, "defaultWriterClosedPromiseInitialize");
			function Mo(e, t) {
				rr(e), an(e, t);
			}
			n$1(Mo, "defaultWriterClosedPromiseInitializeAsRejected");
			function Va(e) {
				rr(e), Uo(e);
			}
			n$1(Va, "defaultWriterClosedPromiseInitializeAsResolved");
			function an(e, t) {
				e._closedPromise_reject !== void 0 && (Q(e._closedPromise), e._closedPromise_reject(t), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "rejected");
			}
			n$1(an, "defaultWriterClosedPromiseReject");
			function Qa(e, t) {
				Mo(e, t);
			}
			n$1(Qa, "defaultWriterClosedPromiseResetToRejected");
			function Uo(e) {
				e._closedPromise_resolve !== void 0 && (e._closedPromise_resolve(void 0), e._closedPromise_resolve = void 0, e._closedPromise_reject = void 0, e._closedPromiseState = "resolved");
			}
			n$1(Uo, "defaultWriterClosedPromiseResolve");
			function nr(e) {
				e._readyPromise = A((t, r) => {
					e._readyPromise_resolve = t, e._readyPromise_reject = r;
				}), e._readyPromiseState = "pending";
			}
			n$1(nr, "defaultWriterReadyPromiseInitialize");
			function sn(e, t) {
				nr(e), No(e, t);
			}
			n$1(sn, "defaultWriterReadyPromiseInitializeAsRejected");
			function xo(e) {
				nr(e), ln(e);
			}
			n$1(xo, "defaultWriterReadyPromiseInitializeAsResolved");
			function No(e, t) {
				e._readyPromise_reject !== void 0 && (Q(e._readyPromise), e._readyPromise_reject(t), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "rejected");
			}
			n$1(No, "defaultWriterReadyPromiseReject");
			function Ya(e) {
				nr(e);
			}
			n$1(Ya, "defaultWriterReadyPromiseReset");
			function Ga(e, t) {
				sn(e, t);
			}
			n$1(Ga, "defaultWriterReadyPromiseResetToRejected");
			function ln(e) {
				e._readyPromise_resolve !== void 0 && (e._readyPromise_resolve(void 0), e._readyPromise_resolve = void 0, e._readyPromise_reject = void 0, e._readyPromiseState = "fulfilled");
			}
			n$1(ln, "defaultWriterReadyPromiseResolve");
			function Za() {
				if (typeof globalThis < "u") return globalThis;
				if (typeof self < "u") return self;
				if (typeof n$2 < "u") return n$2;
			}
			n$1(Za, "getGlobals");
			const un = Za();
			function Ka(e) {
				if (!(typeof e == "function" || typeof e == "object") || e.name !== "DOMException") return false;
				try {
					return new e(), !0;
				} catch {
					return false;
				}
			}
			n$1(Ka, "isDOMExceptionConstructor");
			function Ja() {
				const e = un?.DOMException;
				return Ka(e) ? e : void 0;
			}
			n$1(Ja, "getFromGlobal");
			function Xa() {
				const e = n$1(function(r, s) {
					this.message = r || "", this.name = s || "Error", Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
				}, "DOMException");
				return h(e, "DOMException"), e.prototype = Object.create(Error.prototype), Object.defineProperty(e.prototype, "constructor", {
					value: e,
					writable: true,
					configurable: true
				}), e;
			}
			n$1(Xa, "createPolyfill");
			const es = Ja() || Xa();
			function Ho(e, t, r, s, u, c) {
				const d = Qe(e), m = ko(t);
				e._disturbed = true;
				let R = false, y = T(void 0);
				return A((C, P) => {
					let B;
					if (c !== void 0) {
						if (B = n$1(() => {
							const _ = c.reason !== void 0 ? c.reason : new es("Aborted", "AbortError"), E = [];
							s || E.push(() => t._state === "writable" ? Kt(t, _) : T(void 0)), u || E.push(() => e._state === "readable" ? ie(e, _) : T(void 0)), N(() => Promise.all(E.map((k) => k())), true, _);
						}, "abortAlgorithm"), c.aborted) {
							B();
							return;
						}
						c.addEventListener("abort", B);
					}
					function ae() {
						return A((_, E) => {
							function k(Y) {
								Y ? _() : q(nt(), k, E);
							}
							n$1(k, "next"), k(false);
						});
					}
					n$1(ae, "pipeLoop");
					function nt() {
						return R ? T(true) : q(m._readyPromise, () => A((_, E) => {
							_t(d, {
								_chunkSteps: n$1((k) => {
									y = q(Fo(m, k), void 0, f), _(false);
								}, "_chunkSteps"),
								_closeSteps: n$1(() => _(true), "_closeSteps"),
								_errorSteps: E
							});
						}));
					}
					if (n$1(nt, "pipeStep"), Te(e, d._closedPromise, (_) => (s ? J(true, _) : N(() => Kt(t, _), true, _), null)), Te(t, m._closedPromise, (_) => (u ? J(true, _) : N(() => ie(e, _), true, _), null)), x(e, d._closedPromise, () => (r ? J() : N(() => ja(m)), null)), he(t) || t._state === "closed") {
						const _ = /* @__PURE__ */ new TypeError("the destination writable stream closed before all data could be piped to it");
						u ? J(true, _) : N(() => ie(e, _), true, _);
					}
					Q(ae());
					function Oe() {
						const _ = y;
						return q(y, () => _ !== y ? Oe() : void 0);
					}
					n$1(Oe, "waitForWritesToFinish");
					function Te(_, E, k) {
						_._state === "errored" ? k(_._storedError) : I(E, k);
					}
					n$1(Te, "isOrBecomesErrored");
					function x(_, E, k) {
						_._state === "closed" ? k() : V(E, k);
					}
					n$1(x, "isOrBecomesClosed");
					function N(_, E, k) {
						if (R) return;
						R = true, t._state === "writable" && !he(t) ? V(Oe(), Y) : Y();
						function Y() {
							return g(_(), () => Ce(E, k), (ot) => Ce(true, ot)), null;
						}
						n$1(Y, "doTheRest");
					}
					n$1(N, "shutdownWithAction");
					function J(_, E) {
						R || (R = true, t._state === "writable" && !he(t) ? V(Oe(), () => Ce(_, E)) : Ce(_, E));
					}
					n$1(J, "shutdown");
					function Ce(_, E) {
						return Io(m), _e(d), c !== void 0 && c.removeEventListener("abort", B), _ ? P(E) : C(void 0), null;
					}
					n$1(Ce, "finalize");
				});
			}
			n$1(Ho, "ReadableStreamPipeTo");
			const Cn = class Cn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get desiredSize() {
					if (!or(this)) throw ar("desiredSize");
					return fn(this);
				}
				close() {
					if (!or(this)) throw ar("close");
					if (!Je(this)) throw new TypeError("The stream is not in a state that permits close");
					De(this);
				}
				enqueue(t = void 0) {
					if (!or(this)) throw ar("enqueue");
					if (!Je(this)) throw new TypeError("The stream is not in a state that permits enqueue");
					return Ke(this, t);
				}
				error(t = void 0) {
					if (!or(this)) throw ar("error");
					oe(this, t);
				}
				[Ar](t) {
					Be(this);
					const r = this._cancelAlgorithm(t);
					return ir(this), r;
				}
				[Br](t) {
					const r = this._controlledReadableStream;
					if (this._queue.length > 0) {
						const s = xr(this);
						this._closeRequested && this._queue.length === 0 ? (ir(this), At(r)) : vt(this), t._chunkSteps(s);
					} else eo(r, t), vt(this);
				}
				[kr]() {}
			};
			n$1(Cn, "ReadableStreamDefaultController");
			let ne = Cn;
			Object.defineProperties(ne.prototype, {
				close: { enumerable: true },
				enqueue: { enumerable: true },
				error: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(ne.prototype.close, "close"), h(ne.prototype.enqueue, "enqueue"), h(ne.prototype.error, "error"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(ne.prototype, Symbol.toStringTag, {
				value: "ReadableStreamDefaultController",
				configurable: true
			});
			function or(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledReadableStream") ? false : e instanceof ne;
			}
			n$1(or, "IsReadableStreamDefaultController");
			function vt(e) {
				if (!Vo(e)) return;
				if (e._pulling) {
					e._pullAgain = true;
					return;
				}
				e._pulling = true;
				g(e._pullAlgorithm(), () => (e._pulling = false, e._pullAgain && (e._pullAgain = false, vt(e)), null), (s) => (oe(e, s), null));
			}
			n$1(vt, "ReadableStreamDefaultControllerCallPullIfNeeded");
			function Vo(e) {
				const t = e._controlledReadableStream;
				return !Je(e) || !e._started ? false : !!(qe(t) && $t(t) > 0 || fn(e) > 0);
			}
			n$1(Vo, "ReadableStreamDefaultControllerShouldCallPull");
			function ir(e) {
				e._pullAlgorithm = void 0, e._cancelAlgorithm = void 0, e._strategySizeAlgorithm = void 0;
			}
			n$1(ir, "ReadableStreamDefaultControllerClearAlgorithms");
			function De(e) {
				if (!Je(e)) return;
				const t = e._controlledReadableStream;
				e._closeRequested = true, e._queue.length === 0 && (ir(e), At(t));
			}
			n$1(De, "ReadableStreamDefaultControllerClose");
			function Ke(e, t) {
				if (!Je(e)) return;
				const r = e._controlledReadableStream;
				if (qe(r) && $t(r) > 0) Lr(r, t, false);
				else {
					let s;
					try {
						s = e._strategySizeAlgorithm(t);
					} catch (u) {
						throw oe(e, u), u;
					}
					try {
						Nr(e, t, s);
					} catch (u) {
						throw oe(e, u), u;
					}
				}
				vt(e);
			}
			n$1(Ke, "ReadableStreamDefaultControllerEnqueue");
			function oe(e, t) {
				const r = e._controlledReadableStream;
				r._state === "readable" && (Be(e), ir(e), Zo(r, t));
			}
			n$1(oe, "ReadableStreamDefaultControllerError");
			function fn(e) {
				const t = e._controlledReadableStream._state;
				return t === "errored" ? null : t === "closed" ? 0 : e._strategyHWM - e._queueTotalSize;
			}
			n$1(fn, "ReadableStreamDefaultControllerGetDesiredSize");
			function ts(e) {
				return !Vo(e);
			}
			n$1(ts, "ReadableStreamDefaultControllerHasBackpressure");
			function Je(e) {
				const t = e._controlledReadableStream._state;
				return !e._closeRequested && t === "readable";
			}
			n$1(Je, "ReadableStreamDefaultControllerCanCloseOrEnqueue");
			function Qo(e, t, r, s, u, c, d) {
				t._controlledReadableStream = e, t._queue = void 0, t._queueTotalSize = void 0, Be(t), t._started = false, t._closeRequested = false, t._pullAgain = false, t._pulling = false, t._strategySizeAlgorithm = d, t._strategyHWM = c, t._pullAlgorithm = s, t._cancelAlgorithm = u, e._readableStreamController = t;
				g(T(r()), () => (t._started = true, vt(t), null), (R) => (oe(t, R), null));
			}
			n$1(Qo, "SetUpReadableStreamDefaultController");
			function rs(e, t, r, s) {
				const u = Object.create(ne.prototype);
				let c, d, m;
				t.start !== void 0 ? c = n$1(() => t.start(u), "startAlgorithm") : c = n$1(() => {}, "startAlgorithm"), t.pull !== void 0 ? d = n$1(() => t.pull(u), "pullAlgorithm") : d = n$1(() => T(void 0), "pullAlgorithm"), t.cancel !== void 0 ? m = n$1((R) => t.cancel(R), "cancelAlgorithm") : m = n$1(() => T(void 0), "cancelAlgorithm"), Qo(e, u, c, d, m, r, s);
			}
			n$1(rs, "SetUpReadableStreamDefaultControllerFromUnderlyingSource");
			function ar(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`);
			}
			n$1(ar, "defaultControllerBrandCheckException$1");
			function ns(e, t) {
				return Ie(e._readableStreamController) ? is(e) : os(e);
			}
			n$1(ns, "ReadableStreamTee");
			function os(e, t) {
				const r = Qe(e);
				let s = false, u = false, c = false, d = false, m, R, y, C, P;
				const B = A((x) => {
					P = x;
				});
				function ae() {
					return s ? (u = true, T(void 0)) : (s = true, _t(r, {
						_chunkSteps: n$1((N) => {
							ge(() => {
								u = false;
								const J = N, Ce = N;
								c || Ke(y._readableStreamController, J), d || Ke(C._readableStreamController, Ce), s = false, u && ae();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							s = false, c || De(y._readableStreamController), d || De(C._readableStreamController), (!c || !d) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							s = false;
						}, "_errorSteps")
					}), T(void 0));
				}
				n$1(ae, "pullAlgorithm");
				function nt(x) {
					if (c = true, m = x, d) {
						const J = ie(e, St([m, R]));
						P(J);
					}
					return B;
				}
				n$1(nt, "cancel1Algorithm");
				function Oe(x) {
					if (d = true, R = x, c) {
						const J = ie(e, St([m, R]));
						P(J);
					}
					return B;
				}
				n$1(Oe, "cancel2Algorithm");
				function Te() {}
				return n$1(Te, "startAlgorithm"), y = Et(Te, ae, nt), C = Et(Te, ae, Oe), I(r._closedPromise, (x) => (oe(y._readableStreamController, x), oe(C._readableStreamController, x), (!c || !d) && P(void 0), null)), [y, C];
			}
			n$1(os, "ReadableStreamDefaultTee");
			function is(e) {
				let t = Qe(e), r = false, s = false, u = false, c = false, d = false, m, R, y, C, P;
				const B = A((_) => {
					P = _;
				});
				function ae(_) {
					I(_._closedPromise, (E) => (_ !== t || (K(y._readableStreamController, E), K(C._readableStreamController, E), (!c || !d) && P(void 0)), null));
				}
				n$1(ae, "forwardReaderError");
				function nt() {
					je(t) && (_e(t), t = Qe(e), ae(t)), _t(t, {
						_chunkSteps: n$1((E) => {
							ge(() => {
								s = false, u = false;
								const k = E;
								let Y = E;
								if (!c && !d) try {
									Y = fo(E);
								} catch (ot) {
									K(y._readableStreamController, ot), K(C._readableStreamController, ot), P(ie(e, ot));
									return;
								}
								c || Ht(y._readableStreamController, k), d || Ht(C._readableStreamController, Y), r = false, s ? Te() : u && x();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1(() => {
							r = false, c || wt(y._readableStreamController), d || wt(C._readableStreamController), y._readableStreamController._pendingPullIntos.length > 0 && Vt(y._readableStreamController, 0), C._readableStreamController._pendingPullIntos.length > 0 && Vt(C._readableStreamController, 0), (!c || !d) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							r = false;
						}, "_errorSteps")
					});
				}
				n$1(nt, "pullWithDefaultReader");
				function Oe(_, E) {
					Ee(t) && (_e(t), t = Co(e), ae(t));
					const k = E ? C : y, Y = E ? y : C;
					Eo(t, _, 1, {
						_chunkSteps: n$1((it) => {
							ge(() => {
								s = false, u = false;
								const at = E ? d : c;
								if (E ? c : d) at || Qt(k._readableStreamController, it);
								else {
									let ui;
									try {
										ui = fo(it);
									} catch (kn) {
										K(k._readableStreamController, kn), K(Y._readableStreamController, kn), P(ie(e, kn));
										return;
									}
									at || Qt(k._readableStreamController, it), Ht(Y._readableStreamController, ui);
								}
								r = false, s ? Te() : u && x();
							});
						}, "_chunkSteps"),
						_closeSteps: n$1((it) => {
							r = false;
							const at = E ? d : c, cr = E ? c : d;
							at || wt(k._readableStreamController), cr || wt(Y._readableStreamController), it !== void 0 && (at || Qt(k._readableStreamController, it), !cr && Y._readableStreamController._pendingPullIntos.length > 0 && Vt(Y._readableStreamController, 0)), (!at || !cr) && P(void 0);
						}, "_closeSteps"),
						_errorSteps: n$1(() => {
							r = false;
						}, "_errorSteps")
					});
				}
				n$1(Oe, "pullWithBYOBReader");
				function Te() {
					if (r) return s = true, T(void 0);
					r = true;
					const _ = Gr(y._readableStreamController);
					return _ === null ? nt() : Oe(_._view, false), T(void 0);
				}
				n$1(Te, "pull1Algorithm");
				function x() {
					if (r) return u = true, T(void 0);
					r = true;
					const _ = Gr(C._readableStreamController);
					return _ === null ? nt() : Oe(_._view, true), T(void 0);
				}
				n$1(x, "pull2Algorithm");
				function N(_) {
					if (c = true, m = _, d) {
						const k = ie(e, St([m, R]));
						P(k);
					}
					return B;
				}
				n$1(N, "cancel1Algorithm");
				function J(_) {
					if (d = true, R = _, c) {
						const k = ie(e, St([m, R]));
						P(k);
					}
					return B;
				}
				n$1(J, "cancel2Algorithm");
				function Ce() {}
				return n$1(Ce, "startAlgorithm"), y = Go(Ce, Te, N), C = Go(Ce, x, J), ae(t), [y, C];
			}
			n$1(is, "ReadableByteStreamTee");
			function as(e) {
				return l(e) && typeof e.getReader < "u";
			}
			n$1(as, "isReadableStreamLike");
			function ss(e) {
				return as(e) ? us(e.getReader()) : ls(e);
			}
			n$1(ss, "ReadableStreamFrom");
			function ls(e) {
				let t;
				const r = uo(e, "async"), s = f;
				function u() {
					let d;
					try {
						d = Xi(r);
					} catch (R) {
						return b(R);
					}
					return F(T(d), (R) => {
						if (!l(R)) throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");
						if (ea(R)) De(t._readableStreamController);
						else {
							const C = ta(R);
							Ke(t._readableStreamController, C);
						}
					});
				}
				n$1(u, "pullAlgorithm");
				function c(d) {
					const m = r.iterator;
					let R;
					try {
						R = Ut(m, "return");
					} catch (P) {
						return b(P);
					}
					if (R === void 0) return T(void 0);
					let y;
					try {
						y = z(R, m, [d]);
					} catch (P) {
						return b(P);
					}
					return F(T(y), (P) => {
						if (!l(P)) throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object");
					});
				}
				return n$1(c, "cancelAlgorithm"), t = Et(s, u, c, 0), t;
			}
			n$1(ls, "ReadableStreamFromIterable");
			function us(e) {
				let t;
				const r = f;
				function s() {
					let c;
					try {
						c = e.read();
					} catch (d) {
						return b(d);
					}
					return F(c, (d) => {
						if (!l(d)) throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");
						if (d.done) De(t._readableStreamController);
						else {
							const m = d.value;
							Ke(t._readableStreamController, m);
						}
					});
				}
				n$1(s, "pullAlgorithm");
				function u(c) {
					try {
						return T(e.cancel(c));
					} catch (d) {
						return b(d);
					}
				}
				return n$1(u, "cancelAlgorithm"), t = Et(r, s, u, 0), t;
			}
			n$1(us, "ReadableStreamFromDefaultReader");
			function fs(e, t) {
				ue(e, t);
				const r = e, s = r?.autoAllocateChunkSize, u = r?.cancel, c = r?.pull, d = r?.start, m = r?.type;
				return {
					autoAllocateChunkSize: s === void 0 ? void 0 : Fr(s, `${t} has member 'autoAllocateChunkSize' that`),
					cancel: u === void 0 ? void 0 : cs(u, r, `${t} has member 'cancel' that`),
					pull: c === void 0 ? void 0 : ds(c, r, `${t} has member 'pull' that`),
					start: d === void 0 ? void 0 : hs(d, r, `${t} has member 'start' that`),
					type: m === void 0 ? void 0 : ps(m, `${t} has member 'type' that`)
				};
			}
			n$1(fs, "convertUnderlyingDefaultOrByteSource");
			function cs(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(cs, "convertUnderlyingSourceCancelCallback");
			function ds(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(ds, "convertUnderlyingSourcePullCallback");
			function hs(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(hs, "convertUnderlyingSourceStartCallback");
			function ps(e, t) {
				if (e = `${e}`, e !== "bytes") throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);
				return e;
			}
			n$1(ps, "convertReadableStreamType");
			function bs(e, t) {
				return ue(e, t), { preventCancel: !!e?.preventCancel };
			}
			n$1(bs, "convertIteratorOptions");
			function Yo(e, t) {
				ue(e, t);
				const r = e?.preventAbort, s = e?.preventCancel, u = e?.preventClose, c = e?.signal;
				return c !== void 0 && ms(c, `${t} has member 'signal' that`), {
					preventAbort: !!r,
					preventCancel: !!s,
					preventClose: !!u,
					signal: c
				};
			}
			n$1(Yo, "convertPipeOptions");
			function ms(e, t) {
				if (!Ca(e)) throw new TypeError(`${t} is not an AbortSignal.`);
			}
			n$1(ms, "assertAbortSignal");
			function ys(e, t) {
				ue(e, t);
				const r = e?.readable;
				zr(r, "readable", "ReadableWritablePair"), jr(r, `${t} has member 'readable' that`);
				const s = e?.writable;
				return zr(s, "writable", "ReadableWritablePair"), Bo(s, `${t} has member 'writable' that`), {
					readable: r,
					writable: s
				};
			}
			n$1(ys, "convertReadableWritablePair");
			const Pn = class Pn {
				constructor(t = {}, r = {}) {
					t === void 0 ? t = null : Jn(t, "First parameter");
					const s = Zt(r, "Second parameter"), u = fs(t, "First parameter");
					if (cn(this), u.type === "bytes") {
						if (s.size !== void 0) throw new RangeError("The strategy for a byte stream cannot have a size function");
						const c = Tt(s, 0);
						ca(this, u, c);
					} else {
						const c = Gt(s), d = Tt(s, 1);
						rs(this, u, d, c);
					}
				}
				get locked() {
					if (!We(this)) throw Me("locked");
					return qe(this);
				}
				cancel(t = void 0) {
					return We(this) ? qe(this) ? b(/* @__PURE__ */ new TypeError("Cannot cancel a stream that already has a reader")) : ie(this, t) : b(Me("cancel"));
				}
				getReader(t = void 0) {
					if (!We(this)) throw Me("getReader");
					return ha(t, "First parameter").mode === void 0 ? Qe(this) : Co(this);
				}
				pipeThrough(t, r = {}) {
					if (!We(this)) throw Me("pipeThrough");
					Se(t, 1, "pipeThrough");
					const s = ys(t, "First parameter"), u = Yo(r, "Second parameter");
					if (qe(this)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
					if (Ze(s.writable)) throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
					return Q(Ho(this, s.writable, u.preventClose, u.preventAbort, u.preventCancel, u.signal)), s.readable;
				}
				pipeTo(t, r = {}) {
					if (!We(this)) return b(Me("pipeTo"));
					if (t === void 0) return b("Parameter 1 is required in 'pipeTo'.");
					if (!Ge(t)) return b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));
					let s;
					try {
						s = Yo(r, "Second parameter");
					} catch (u) {
						return b(u);
					}
					return qe(this) ? b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")) : Ze(t) ? b(/* @__PURE__ */ new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")) : Ho(this, t, s.preventClose, s.preventAbort, s.preventCancel, s.signal);
				}
				tee() {
					if (!We(this)) throw Me("tee");
					return St(ns(this));
				}
				values(t = void 0) {
					if (!We(this)) throw Me("values");
					const r = bs(t, "First parameter");
					return Ki(this, r.preventCancel);
				}
				[Ur](t) {
					return this.values(t);
				}
				static from(t) {
					return ss(t);
				}
			};
			n$1(Pn, "ReadableStream");
			let L = Pn;
			Object.defineProperties(L, { from: { enumerable: true } }), Object.defineProperties(L.prototype, {
				cancel: { enumerable: true },
				getReader: { enumerable: true },
				pipeThrough: { enumerable: true },
				pipeTo: { enumerable: true },
				tee: { enumerable: true },
				values: { enumerable: true },
				locked: { enumerable: true }
			}), h(L.from, "from"), h(L.prototype.cancel, "cancel"), h(L.prototype.getReader, "getReader"), h(L.prototype.pipeThrough, "pipeThrough"), h(L.prototype.pipeTo, "pipeTo"), h(L.prototype.tee, "tee"), h(L.prototype.values, "values"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(L.prototype, Symbol.toStringTag, {
				value: "ReadableStream",
				configurable: true
			}), Object.defineProperty(L.prototype, Ur, {
				value: L.prototype.values,
				writable: true,
				configurable: true
			});
			function Et(e, t, r, s = 1, u = () => 1) {
				const c = Object.create(L.prototype);
				cn(c);
				return Qo(c, Object.create(ne.prototype), e, t, r, s, u), c;
			}
			n$1(Et, "CreateReadableStream");
			function Go(e, t, r) {
				const s = Object.create(L.prototype);
				cn(s);
				return To(s, Object.create(te.prototype), e, t, r, 0, void 0), s;
			}
			n$1(Go, "CreateReadableByteStream");
			function cn(e) {
				e._state = "readable", e._reader = void 0, e._storedError = void 0, e._disturbed = false;
			}
			n$1(cn, "InitializeReadableStream");
			function We(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_readableStreamController") ? false : e instanceof L;
			}
			n$1(We, "IsReadableStream");
			function qe(e) {
				return e._reader !== void 0;
			}
			n$1(qe, "IsReadableStreamLocked");
			function ie(e, t) {
				if (e._disturbed = true, e._state === "closed") return T(void 0);
				if (e._state === "errored") return b(e._storedError);
				At(e);
				const r = e._reader;
				if (r !== void 0 && je(r)) {
					const u = r._readIntoRequests;
					r._readIntoRequests = new D(), u.forEach((c) => {
						c._closeSteps(void 0);
					});
				}
				return F(e._readableStreamController[Ar](t), f);
			}
			n$1(ie, "ReadableStreamCancel");
			function At(e) {
				e._state = "closed";
				const t = e._reader;
				if (t !== void 0 && (Zn(t), Ee(t))) {
					const r = t._readRequests;
					t._readRequests = new D(), r.forEach((s) => {
						s._closeSteps();
					});
				}
			}
			n$1(At, "ReadableStreamClose");
			function Zo(e, t) {
				e._state = "errored", e._storedError = t;
				const r = e._reader;
				r !== void 0 && (Or(r, t), Ee(r) ? ro(r, t) : Ao(r, t));
			}
			n$1(Zo, "ReadableStreamError");
			function Me(e) {
				return /* @__PURE__ */ new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`);
			}
			n$1(Me, "streamBrandCheckException$1");
			function Ko(e, t) {
				ue(e, t);
				const r = e?.highWaterMark;
				return zr(r, "highWaterMark", "QueuingStrategyInit"), { highWaterMark: Ir(r) };
			}
			n$1(Ko, "convertQueuingStrategyInit");
			const Jo = n$1((e) => e.byteLength, "byteLengthSizeFunction");
			h(Jo, "size");
			const vn = class vn {
				constructor(t) {
					Se(t, 1, "ByteLengthQueuingStrategy"), t = Ko(t, "First parameter"), this._byteLengthQueuingStrategyHighWaterMark = t.highWaterMark;
				}
				get highWaterMark() {
					if (!ei(this)) throw Xo("highWaterMark");
					return this._byteLengthQueuingStrategyHighWaterMark;
				}
				get size() {
					if (!ei(this)) throw Xo("size");
					return Jo;
				}
			};
			n$1(vn, "ByteLengthQueuingStrategy");
			let Xe = vn;
			Object.defineProperties(Xe.prototype, {
				highWaterMark: { enumerable: true },
				size: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Xe.prototype, Symbol.toStringTag, {
				value: "ByteLengthQueuingStrategy",
				configurable: true
			});
			function Xo(e) {
				return /* @__PURE__ */ new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`);
			}
			n$1(Xo, "byteLengthBrandCheckException");
			function ei(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_byteLengthQueuingStrategyHighWaterMark") ? false : e instanceof Xe;
			}
			n$1(ei, "IsByteLengthQueuingStrategy");
			const ti = n$1(() => 1, "countSizeFunction");
			h(ti, "size");
			const En = class En {
				constructor(t) {
					Se(t, 1, "CountQueuingStrategy"), t = Ko(t, "First parameter"), this._countQueuingStrategyHighWaterMark = t.highWaterMark;
				}
				get highWaterMark() {
					if (!ni(this)) throw ri("highWaterMark");
					return this._countQueuingStrategyHighWaterMark;
				}
				get size() {
					if (!ni(this)) throw ri("size");
					return ti;
				}
			};
			n$1(En, "CountQueuingStrategy");
			let et = En;
			Object.defineProperties(et.prototype, {
				highWaterMark: { enumerable: true },
				size: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(et.prototype, Symbol.toStringTag, {
				value: "CountQueuingStrategy",
				configurable: true
			});
			function ri(e) {
				return /* @__PURE__ */ new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`);
			}
			n$1(ri, "countBrandCheckException");
			function ni(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_countQueuingStrategyHighWaterMark") ? false : e instanceof et;
			}
			n$1(ni, "IsCountQueuingStrategy");
			function gs(e, t) {
				ue(e, t);
				const r = e?.cancel, s = e?.flush, u = e?.readableType, c = e?.start, d = e?.transform, m = e?.writableType;
				return {
					cancel: r === void 0 ? void 0 : Rs(r, e, `${t} has member 'cancel' that`),
					flush: s === void 0 ? void 0 : _s(s, e, `${t} has member 'flush' that`),
					readableType: u,
					start: c === void 0 ? void 0 : Ss(c, e, `${t} has member 'start' that`),
					transform: d === void 0 ? void 0 : ws(d, e, `${t} has member 'transform' that`),
					writableType: m
				};
			}
			n$1(gs, "convertTransformer");
			function _s(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(_s, "convertTransformerFlushCallback");
			function Ss(e, t, r) {
				return Z(e, r), (s) => z(e, t, [s]);
			}
			n$1(Ss, "convertTransformerStartCallback");
			function ws(e, t, r) {
				return Z(e, r), (s, u) => j(e, t, [s, u]);
			}
			n$1(ws, "convertTransformerTransformCallback");
			function Rs(e, t, r) {
				return Z(e, r), (s) => j(e, t, [s]);
			}
			n$1(Rs, "convertTransformerCancelCallback");
			const An = class An {
				constructor(t = {}, r = {}, s = {}) {
					t === void 0 && (t = null);
					const u = Zt(r, "Second parameter"), c = Zt(s, "Third parameter"), d = gs(t, "First parameter");
					if (d.readableType !== void 0) throw new RangeError("Invalid readableType specified");
					if (d.writableType !== void 0) throw new RangeError("Invalid writableType specified");
					const m = Tt(c, 0), R = Gt(c), y = Tt(u, 1), C = Gt(u);
					let P;
					const B = A((ae) => {
						P = ae;
					});
					Ts(this, B, y, C, m, R), Ps(this, d), d.start !== void 0 ? P(d.start(this._transformStreamController)) : P(void 0);
				}
				get readable() {
					if (!oi(this)) throw li("readable");
					return this._readable;
				}
				get writable() {
					if (!oi(this)) throw li("writable");
					return this._writable;
				}
			};
			n$1(An, "TransformStream");
			let tt = An;
			Object.defineProperties(tt.prototype, {
				readable: { enumerable: true },
				writable: { enumerable: true }
			}), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(tt.prototype, Symbol.toStringTag, {
				value: "TransformStream",
				configurable: true
			});
			function Ts(e, t, r, s, u, c) {
				function d() {
					return t;
				}
				n$1(d, "startAlgorithm");
				function m(B) {
					return As(e, B);
				}
				n$1(m, "writeAlgorithm");
				function R(B) {
					return Bs(e, B);
				}
				n$1(R, "abortAlgorithm");
				function y() {
					return ks(e);
				}
				n$1(y, "closeAlgorithm"), e._writable = Ea(d, m, y, R, r, s);
				function C() {
					return Ws(e);
				}
				n$1(C, "pullAlgorithm");
				function P(B) {
					return qs(e, B);
				}
				n$1(P, "cancelAlgorithm"), e._readable = Et(d, C, P, u, c), e._backpressure = void 0, e._backpressureChangePromise = void 0, e._backpressureChangePromise_resolve = void 0, sr(e, true), e._transformStreamController = void 0;
			}
			n$1(Ts, "InitializeTransformStream");
			function oi(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_transformStreamController") ? false : e instanceof tt;
			}
			n$1(oi, "IsTransformStream");
			function ii(e, t) {
				oe(e._readable._readableStreamController, t), dn(e, t);
			}
			n$1(ii, "TransformStreamError");
			function dn(e, t) {
				ur(e._transformStreamController), Ct(e._writable._writableStreamController, t), hn(e);
			}
			n$1(dn, "TransformStreamErrorWritableAndUnblockWrite");
			function hn(e) {
				e._backpressure && sr(e, false);
			}
			n$1(hn, "TransformStreamUnblockWrite");
			function sr(e, t) {
				e._backpressureChangePromise !== void 0 && e._backpressureChangePromise_resolve(), e._backpressureChangePromise = A((r) => {
					e._backpressureChangePromise_resolve = r;
				}), e._backpressure = t;
			}
			n$1(sr, "TransformStreamSetBackpressure");
			const Bn = class Bn {
				constructor() {
					throw new TypeError("Illegal constructor");
				}
				get desiredSize() {
					if (!lr(this)) throw fr("desiredSize");
					const t = this._controlledTransformStream._readable._readableStreamController;
					return fn(t);
				}
				enqueue(t = void 0) {
					if (!lr(this)) throw fr("enqueue");
					ai(this, t);
				}
				error(t = void 0) {
					if (!lr(this)) throw fr("error");
					vs(this, t);
				}
				terminate() {
					if (!lr(this)) throw fr("terminate");
					Es(this);
				}
			};
			n$1(Bn, "TransformStreamDefaultController");
			let pe = Bn;
			Object.defineProperties(pe.prototype, {
				enqueue: { enumerable: true },
				error: { enumerable: true },
				terminate: { enumerable: true },
				desiredSize: { enumerable: true }
			}), h(pe.prototype.enqueue, "enqueue"), h(pe.prototype.error, "error"), h(pe.prototype.terminate, "terminate"), typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pe.prototype, Symbol.toStringTag, {
				value: "TransformStreamDefaultController",
				configurable: true
			});
			function lr(e) {
				return !l(e) || !Object.prototype.hasOwnProperty.call(e, "_controlledTransformStream") ? false : e instanceof pe;
			}
			n$1(lr, "IsTransformStreamDefaultController");
			function Cs(e, t, r, s, u) {
				t._controlledTransformStream = e, e._transformStreamController = t, t._transformAlgorithm = r, t._flushAlgorithm = s, t._cancelAlgorithm = u, t._finishPromise = void 0, t._finishPromise_resolve = void 0, t._finishPromise_reject = void 0;
			}
			n$1(Cs, "SetUpTransformStreamDefaultController");
			function Ps(e, t) {
				const r = Object.create(pe.prototype);
				let s, u, c;
				t.transform !== void 0 ? s = n$1((d) => t.transform(d, r), "transformAlgorithm") : s = n$1((d) => {
					try {
						return ai(r, d), T(void 0);
					} catch (m) {
						return b(m);
					}
				}, "transformAlgorithm"), t.flush !== void 0 ? u = n$1(() => t.flush(r), "flushAlgorithm") : u = n$1(() => T(void 0), "flushAlgorithm"), t.cancel !== void 0 ? c = n$1((d) => t.cancel(d), "cancelAlgorithm") : c = n$1(() => T(void 0), "cancelAlgorithm"), Cs(e, r, s, u, c);
			}
			n$1(Ps, "SetUpTransformStreamDefaultControllerFromTransformer");
			function ur(e) {
				e._transformAlgorithm = void 0, e._flushAlgorithm = void 0, e._cancelAlgorithm = void 0;
			}
			n$1(ur, "TransformStreamDefaultControllerClearAlgorithms");
			function ai(e, t) {
				const r = e._controlledTransformStream, s = r._readable._readableStreamController;
				if (!Je(s)) throw new TypeError("Readable side is not in a state that permits enqueue");
				try {
					Ke(s, t);
				} catch (c) {
					throw dn(r, c), r._readable._storedError;
				}
				ts(s) !== r._backpressure && sr(r, true);
			}
			n$1(ai, "TransformStreamDefaultControllerEnqueue");
			function vs(e, t) {
				ii(e._controlledTransformStream, t);
			}
			n$1(vs, "TransformStreamDefaultControllerError");
			function si(e, t) {
				return F(e._transformAlgorithm(t), void 0, (s) => {
					throw ii(e._controlledTransformStream, s), s;
				});
			}
			n$1(si, "TransformStreamDefaultControllerPerformTransform");
			function Es(e) {
				const t = e._controlledTransformStream, r = t._readable._readableStreamController;
				De(r);
				dn(t, /* @__PURE__ */ new TypeError("TransformStream terminated"));
			}
			n$1(Es, "TransformStreamDefaultControllerTerminate");
			function As(e, t) {
				const r = e._transformStreamController;
				if (e._backpressure) {
					const s = e._backpressureChangePromise;
					return F(s, () => {
						const u = e._writable;
						if (u._state === "erroring") throw u._storedError;
						return si(r, t);
					});
				}
				return si(r, t);
			}
			n$1(As, "TransformStreamDefaultSinkWriteAlgorithm");
			function Bs(e, t) {
				const r = e._transformStreamController;
				if (r._finishPromise !== void 0) return r._finishPromise;
				const s = e._readable;
				r._finishPromise = A((c, d) => {
					r._finishPromise_resolve = c, r._finishPromise_reject = d;
				});
				const u = r._cancelAlgorithm(t);
				return ur(r), g(u, () => (s._state === "errored" ? rt(r, s._storedError) : (oe(s._readableStreamController, t), pn(r)), null), (c) => (oe(s._readableStreamController, c), rt(r, c), null)), r._finishPromise;
			}
			n$1(Bs, "TransformStreamDefaultSinkAbortAlgorithm");
			function ks(e) {
				const t = e._transformStreamController;
				if (t._finishPromise !== void 0) return t._finishPromise;
				const r = e._readable;
				t._finishPromise = A((u, c) => {
					t._finishPromise_resolve = u, t._finishPromise_reject = c;
				});
				const s = t._flushAlgorithm();
				return ur(t), g(s, () => (r._state === "errored" ? rt(t, r._storedError) : (De(r._readableStreamController), pn(t)), null), (u) => (oe(r._readableStreamController, u), rt(t, u), null)), t._finishPromise;
			}
			n$1(ks, "TransformStreamDefaultSinkCloseAlgorithm");
			function Ws(e) {
				return sr(e, false), e._backpressureChangePromise;
			}
			n$1(Ws, "TransformStreamDefaultSourcePullAlgorithm");
			function qs(e, t) {
				const r = e._transformStreamController;
				if (r._finishPromise !== void 0) return r._finishPromise;
				const s = e._writable;
				r._finishPromise = A((c, d) => {
					r._finishPromise_resolve = c, r._finishPromise_reject = d;
				});
				const u = r._cancelAlgorithm(t);
				return ur(r), g(u, () => (s._state === "errored" ? rt(r, s._storedError) : (Ct(s._writableStreamController, t), hn(e), pn(r)), null), (c) => (Ct(s._writableStreamController, c), hn(e), rt(r, c), null)), r._finishPromise;
			}
			n$1(qs, "TransformStreamDefaultSourceCancelAlgorithm");
			function fr(e) {
				return /* @__PURE__ */ new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`);
			}
			n$1(fr, "defaultControllerBrandCheckException");
			function pn(e) {
				e._finishPromise_resolve !== void 0 && (e._finishPromise_resolve(), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
			}
			n$1(pn, "defaultControllerFinishPromiseResolve");
			function rt(e, t) {
				e._finishPromise_reject !== void 0 && (Q(e._finishPromise), e._finishPromise_reject(t), e._finishPromise_resolve = void 0, e._finishPromise_reject = void 0);
			}
			n$1(rt, "defaultControllerFinishPromiseReject");
			function li(e) {
				return /* @__PURE__ */ new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`);
			}
			n$1(li, "streamBrandCheckException"), a.ByteLengthQueuingStrategy = Xe, a.CountQueuingStrategy = et, a.ReadableByteStreamController = te, a.ReadableStream = L, a.ReadableStreamBYOBReader = ce, a.ReadableStreamBYOBRequest = Re, a.ReadableStreamDefaultController = ne, a.ReadableStreamDefaultReader = fe, a.TransformStream = tt, a.TransformStreamDefaultController = pe, a.WritableStream = de, a.WritableStreamDefaultController = ke, a.WritableStreamDefaultWriter = re;
		});
	}(kt, kt.exports)), kt.exports;
}
n$1(Ns, "requirePonyfill_es2018");
var mi;
function Hs() {
	if (mi) return pi;
	mi = 1;
	const i = 65536;
	if (!globalThis.ReadableStream) try {
		const o = __require("node:process"), { emitWarning: a } = o;
		try {
			o.emitWarning = () => {}, Object.assign(globalThis, __require("node:stream/web")), o.emitWarning = a;
		} catch (f) {
			throw o.emitWarning = a, f;
		}
	} catch {
		Object.assign(globalThis, Ns());
	}
	try {
		const { Blob: o } = __require("buffer");
		o && !o.prototype.stream && (o.prototype.stream = n$1(function(f) {
			let l = 0;
			const p = this;
			return new ReadableStream({
				type: "bytes",
				async pull(h) {
					const v = await p.slice(l, Math.min(p.size, l + i)).arrayBuffer();
					l += v.byteLength, h.enqueue(new Uint8Array(v)), l === p.size && h.close();
				}
			});
		}, "name"));
	} catch {}
	return pi;
}
n$1(Hs, "requireStreams"), Hs();
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var yi = 65536;
async function* Wn(i, o = true) {
	for (const a of i) if ("stream" in a) yield* a.stream();
	else if (ArrayBuffer.isView(a)) if (o) {
		let f = a.byteOffset;
		const l = a.byteOffset + a.byteLength;
		for (; f !== l;) {
			const p = Math.min(l - f, yi), h = a.buffer.slice(f, f + p);
			f += h.byteLength, yield new Uint8Array(h);
		}
	} else yield a;
	else {
		let f = 0, l = a;
		for (; f !== l.size;) {
			const h = await l.slice(f, Math.min(l.size, f + yi)).arrayBuffer();
			f += h.byteLength, yield new Uint8Array(h);
		}
	}
}
n$1(Wn, "toIterator");
var gi = (ze = class {
	constructor(o = [], a = {}) {
		be(this, ve, []);
		be(this, zt, "");
		be(this, bt, 0);
		be(this, Cr, "transparent");
		if (typeof o != "object" || o === null) throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
		if (typeof o[Symbol.iterator] != "function") throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
		if (typeof a != "object" && typeof a != "function") throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
		a === null && (a = {});
		const f = new TextEncoder();
		for (const p of o) {
			let h;
			ArrayBuffer.isView(p) ? h = new Uint8Array(p.buffer.slice(p.byteOffset, p.byteOffset + p.byteLength)) : p instanceof ArrayBuffer ? h = new Uint8Array(p.slice(0)) : p instanceof ze ? h = p : h = f.encode(`${p}`), X(this, bt, O(this, bt) + (ArrayBuffer.isView(h) ? h.byteLength : h.size)), O(this, ve).push(h);
		}
		X(this, Cr, `${a.endings === void 0 ? "transparent" : a.endings}`);
		const l = a.type === void 0 ? "" : String(a.type);
		X(this, zt, /^[\x20-\x7E]*$/.test(l) ? l : "");
	}
	get size() {
		return O(this, bt);
	}
	get type() {
		return O(this, zt);
	}
	async text() {
		const o = new TextDecoder();
		let a = "";
		for await (const f of Wn(O(this, ve), false)) a += o.decode(f, { stream: true });
		return a += o.decode(), a;
	}
	async arrayBuffer() {
		const o = new Uint8Array(this.size);
		let a = 0;
		for await (const f of Wn(O(this, ve), false)) o.set(f, a), a += f.length;
		return o.buffer;
	}
	stream() {
		const o = Wn(O(this, ve), true);
		return new globalThis.ReadableStream({
			type: "bytes",
			async pull(a) {
				const f = await o.next();
				f.done ? a.close() : a.enqueue(f.value);
			},
			async cancel() {
				await o.return();
			}
		});
	}
	slice(o = 0, a = this.size, f = "") {
		const { size: l } = this;
		let p = o < 0 ? Math.max(l + o, 0) : Math.min(o, l), h = a < 0 ? Math.max(l + a, 0) : Math.min(a, l);
		const S = Math.max(h - p, 0), v = O(this, ve), w = [];
		let A = 0;
		for (const b of v) {
			if (A >= S) break;
			const q = ArrayBuffer.isView(b) ? b.byteLength : b.size;
			if (p && q <= p) p -= q, h -= q;
			else {
				let g;
				ArrayBuffer.isView(b) ? (g = b.subarray(p, Math.min(q, h)), A += g.byteLength) : (g = b.slice(p, Math.min(q, h)), A += g.size), h -= q, w.push(g), p = 0;
			}
		}
		const T = new ze([], { type: String(f).toLowerCase() });
		return X(T, bt, S), X(T, ve, w), T;
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
	static [Symbol.hasInstance](o) {
		return o && typeof o == "object" && typeof o.constructor == "function" && (typeof o.stream == "function" || typeof o.arrayBuffer == "function") && /^(Blob|File)$/.test(o[Symbol.toStringTag]);
	}
}, ve = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), bt = /* @__PURE__ */ new WeakMap(), Cr = /* @__PURE__ */ new WeakMap(), n$1(ze, "Blob"), ze);
Object.defineProperties(gi.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});
var ut = gi;
var qn = (mt = class extends ut {
	constructor(a, f, l = {}) {
		if (arguments.length < 2) throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
		super(a, l);
		be(this, It, 0);
		be(this, Ft, "");
		l === null && (l = {});
		const p = l.lastModified === void 0 ? Date.now() : Number(l.lastModified);
		Number.isNaN(p) || X(this, It, p), X(this, Ft, String(f));
	}
	get name() {
		return O(this, Ft);
	}
	get lastModified() {
		return O(this, It);
	}
	get [Symbol.toStringTag]() {
		return "File";
	}
	static [Symbol.hasInstance](a) {
		return !!a && a instanceof ut && /^(File)$/.test(a[Symbol.toStringTag]);
	}
}, It = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), n$1(mt, "File"), mt);
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var { toStringTag: Wt, iterator: Qs, hasInstance: Ys } = Symbol, _i = Math.random, Gs = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","), Si = n$1((i, o, a) => (i += "", /^(Blob|File)$/.test(o && o[Wt]) ? [(a = a !== void 0 ? a + "" : o[Wt] == "File" ? o.name : "blob", i), o.name !== a || o[Wt] == "blob" ? new qn([o], a, o) : o] : [i, o + ""]), "f"), On = n$1((i, o) => (o ? i : i.replace(/\r?\n|\r/g, `\r
`)).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22"), "e$1"), Ue = n$1((i, o, a) => {
	if (o.length < a) throw new TypeError(`Failed to execute '${i}' on 'FormData': ${a} arguments required, but only ${o.length} present.`);
}, "x");
var br = (yt = class {
	constructor(...o) {
		be(this, ee, []);
		if (o.length) throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.");
	}
	get [Wt]() {
		return "FormData";
	}
	[Qs]() {
		return this.entries();
	}
	static [Ys](o) {
		return o && typeof o == "object" && o[Wt] === "FormData" && !Gs.some((a) => typeof o[a] != "function");
	}
	append(...o) {
		Ue("append", arguments, 2), O(this, ee).push(Si(...o));
	}
	delete(o) {
		Ue("delete", arguments, 1), o += "", X(this, ee, O(this, ee).filter(([a]) => a !== o));
	}
	get(o) {
		Ue("get", arguments, 1), o += "";
		for (var a = O(this, ee), f = a.length, l = 0; l < f; l++) if (a[l][0] === o) return a[l][1];
		return null;
	}
	getAll(o, a) {
		return Ue("getAll", arguments, 1), a = [], o += "", O(this, ee).forEach((f) => f[0] === o && a.push(f[1])), a;
	}
	has(o) {
		return Ue("has", arguments, 1), o += "", O(this, ee).some((a) => a[0] === o);
	}
	forEach(o, a) {
		Ue("forEach", arguments, 1);
		for (var [f, l] of this) o.call(a, l, f, this);
	}
	set(...o) {
		Ue("set", arguments, 2);
		var a = [], f = true;
		o = Si(...o), O(this, ee).forEach((l) => {
			l[0] === o[0] ? f && (f = !a.push(o)) : a.push(l);
		}), f && a.push(o), X(this, ee, a);
	}
	*entries() {
		yield* O(this, ee);
	}
	*keys() {
		for (var [o] of this) yield o;
	}
	*values() {
		for (var [, o] of this) yield o;
	}
}, ee = /* @__PURE__ */ new WeakMap(), n$1(yt, "FormData"), yt);
function Zs(i, o = ut) {
	var a = `${_i()}${_i()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), f = [], l = `--${a}\r
Content-Disposition: form-data; name="`;
	return i.forEach((p, h) => typeof p == "string" ? f.push(l + On(h) + `"\r
\r
${p.replace(/\r(?!\n)|(?<!\r)\n/g, `\r
`)}\r
`) : f.push(l + On(h) + `"; filename="${On(p.name, 1)}"\r
Content-Type: ${p.type || "application/octet-stream"}\r
\r
`, p, `\r
`)), f.push(`--${a}--`), new o(f, { type: "multipart/form-data; boundary=" + a });
}
n$1(Zs, "formDataToBlob");
var Un = class Un extends Error {
	constructor(o, a) {
		super(o), Error.captureStackTrace(this, this.constructor), this.type = a;
	}
	get name() {
		return this.constructor.name;
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
};
n$1(Un, "FetchBaseError");
var ft = Un;
var xn = class xn extends ft {
	constructor(o, a, f) {
		super(o, a), f && (this.code = this.errno = f.code, this.erroredSysCall = f.syscall);
	}
};
n$1(xn, "FetchError");
var G = xn;
var mr = Symbol.toStringTag;
var wi = n$1((i) => typeof i == "object" && typeof i.append == "function" && typeof i.delete == "function" && typeof i.get == "function" && typeof i.getAll == "function" && typeof i.has == "function" && typeof i.set == "function" && typeof i.sort == "function" && i[mr] === "URLSearchParams", "isURLSearchParameters");
var yr = n$1((i) => i && typeof i == "object" && typeof i.arrayBuffer == "function" && typeof i.type == "string" && typeof i.stream == "function" && typeof i.constructor == "function" && /^(Blob|File)$/.test(i[mr]), "isBlob");
var Ks = n$1((i) => typeof i == "object" && (i[mr] === "AbortSignal" || i[mr] === "EventTarget"), "isAbortSignal");
var Js = n$1((i, o) => {
	const a = new URL(o).hostname, f = new URL(i).hostname;
	return a === f || a.endsWith(`.${f}`);
}, "isDomainOrSubdomain");
var Xs = n$1((i, o) => {
	return new URL(o).protocol === new URL(i).protocol;
}, "isSameProtocol");
var el = promisify(me.pipeline);
var H = Symbol("Body internals");
var Nn = class Nn {
	constructor(o, { size: a = 0 } = {}) {
		let f = null;
		o === null ? o = null : wi(o) ? o = Buffer$1.from(o.toString()) : yr(o) || Buffer$1.isBuffer(o) || (types.isAnyArrayBuffer(o) ? o = Buffer$1.from(o) : ArrayBuffer.isView(o) ? o = Buffer$1.from(o.buffer, o.byteOffset, o.byteLength) : o instanceof me || (o instanceof br ? (o = Zs(o), f = o.type.split("=")[1]) : o = Buffer$1.from(String(o))));
		let l = o;
		Buffer$1.isBuffer(o) ? l = me.Readable.from(o) : yr(o) && (l = me.Readable.from(o.stream())), this[H] = {
			body: o,
			stream: l,
			boundary: f,
			disturbed: false,
			error: null
		}, this.size = a, o instanceof me && o.on("error", (p) => {
			const h = p instanceof ft ? p : new G(`Invalid response body while trying to fetch ${this.url}: ${p.message}`, "system", p);
			this[H].error = h;
		});
	}
	get body() {
		return this[H].stream;
	}
	get bodyUsed() {
		return this[H].disturbed;
	}
	async arrayBuffer() {
		const { buffer: o, byteOffset: a, byteLength: f } = await zn(this);
		return o.slice(a, a + f);
	}
	async formData() {
		const o = this.headers.get("content-type");
		if (o.startsWith("application/x-www-form-urlencoded")) {
			const f = new br(), l = new URLSearchParams(await this.text());
			for (const [p, h] of l) f.append(p, h);
			return f;
		}
		const { toFormData: a } = await import('../build/multipart-parser-DaQXQN8s.mjs');
		return a(this.body, o);
	}
	async blob() {
		const o = this.headers && this.headers.get("content-type") || this[H].body && this[H].body.type || "";
		return new ut([await this.arrayBuffer()], { type: o });
	}
	async json() {
		const o = await this.text();
		return JSON.parse(o);
	}
	async text() {
		const o = await zn(this);
		return new TextDecoder().decode(o);
	}
	buffer() {
		return zn(this);
	}
};
n$1(Nn, "Body");
var xe = Nn;
xe.prototype.buffer = deprecate(xe.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer"), Object.defineProperties(xe.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true },
	data: { get: deprecate(() => {}, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
});
async function zn(i) {
	if (i[H].disturbed) throw new TypeError(`body used already for: ${i.url}`);
	if (i[H].disturbed = true, i[H].error) throw i[H].error;
	const { body: o } = i;
	if (o === null) return Buffer$1.alloc(0);
	if (!(o instanceof me)) return Buffer$1.alloc(0);
	const a = [];
	let f = 0;
	try {
		for await (const l of o) {
			if (i.size > 0 && f + l.length > i.size) {
				const p = new G(`content size at ${i.url} over limit: ${i.size}`, "max-size");
				throw o.destroy(p), p;
			}
			f += l.length, a.push(l);
		}
	} catch (l) {
		throw l instanceof ft ? l : new G(`Invalid response body while trying to fetch ${i.url}: ${l.message}`, "system", l);
	}
	if (o.readableEnded === true || o._readableState.ended === true) try {
		return a.every((l) => typeof l == "string") ? Buffer$1.from(a.join("")) : Buffer$1.concat(a, f);
	} catch (l) {
		throw new G(`Could not create Buffer from response body for ${i.url}: ${l.message}`, "system", l);
	}
	else throw new G(`Premature close of server response while trying to fetch ${i.url}`);
}
n$1(zn, "consumeBody");
var In = n$1((i, o) => {
	let a, f, { body: l } = i[H];
	if (i.bodyUsed) throw new Error("cannot clone body after it is used");
	return l instanceof me && typeof l.getBoundary != "function" && (a = new PassThrough({ highWaterMark: o }), f = new PassThrough({ highWaterMark: o }), l.pipe(a), l.pipe(f), i[H].stream = a, l = f), l;
}, "clone");
var tl = deprecate((i) => i.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
var Ri = n$1((i, o) => i === null ? null : typeof i == "string" ? "text/plain;charset=UTF-8" : wi(i) ? "application/x-www-form-urlencoded;charset=UTF-8" : yr(i) ? i.type || null : Buffer$1.isBuffer(i) || types.isAnyArrayBuffer(i) || ArrayBuffer.isView(i) ? null : i instanceof br ? `multipart/form-data; boundary=${o[H].boundary}` : i && typeof i.getBoundary == "function" ? `multipart/form-data;boundary=${tl(i)}` : i instanceof me ? null : "text/plain;charset=UTF-8", "extractContentType");
var rl = n$1((i) => {
	const { body: o } = i[H];
	return o === null ? 0 : yr(o) ? o.size : Buffer$1.isBuffer(o) ? o.length : o && typeof o.getLengthSync == "function" && o.hasKnownLength && o.hasKnownLength() ? o.getLengthSync() : null;
}, "getTotalBytes");
var nl = n$1(async (i, { body: o }) => {
	o === null ? i.end() : await el(o, i);
}, "writeToStream");
var gr = typeof Bt.validateHeaderName == "function" ? Bt.validateHeaderName : (i) => {
	if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i)) {
		const o = /* @__PURE__ */ new TypeError(`Header name must be a valid HTTP token [${i}]`);
		throw Object.defineProperty(o, "code", { value: "ERR_INVALID_HTTP_TOKEN" }), o;
	}
};
var Fn = typeof Bt.validateHeaderValue == "function" ? Bt.validateHeaderValue : (i, o) => {
	if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)) {
		const a = /* @__PURE__ */ new TypeError(`Invalid character in header content ["${i}"]`);
		throw Object.defineProperty(a, "code", { value: "ERR_INVALID_CHAR" }), a;
	}
};
var Pr = class Pr extends URLSearchParams {
	constructor(o) {
		let a = [];
		if (o instanceof Pr) {
			const f = o.raw();
			for (const [l, p] of Object.entries(f)) a.push(...p.map((h) => [l, h]));
		} else if (o != null) if (typeof o == "object" && !types.isBoxedPrimitive(o)) {
			const f = o[Symbol.iterator];
			if (f == null) a.push(...Object.entries(o));
			else {
				if (typeof f != "function") throw new TypeError("Header pairs must be iterable");
				a = [...o].map((l) => {
					if (typeof l != "object" || types.isBoxedPrimitive(l)) throw new TypeError("Each header pair must be an iterable object");
					return [...l];
				}).map((l) => {
					if (l.length !== 2) throw new TypeError("Each header pair must be a name/value tuple");
					return [...l];
				});
			}
		} else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
		return a = a.length > 0 ? a.map(([f, l]) => (gr(f), Fn(f, String(l)), [String(f).toLowerCase(), String(l)])) : void 0, super(a), new Proxy(this, { get(f, l, p) {
			switch (l) {
				case "append":
				case "set": return (h, S) => (gr(h), Fn(h, String(S)), URLSearchParams.prototype[l].call(f, String(h).toLowerCase(), String(S)));
				case "delete":
				case "has":
				case "getAll": return (h) => (gr(h), URLSearchParams.prototype[l].call(f, String(h).toLowerCase()));
				case "keys": return () => (f.sort(), new Set(URLSearchParams.prototype.keys.call(f)).keys());
				default: return Reflect.get(f, l, p);
			}
		} });
	}
	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}
	toString() {
		return Object.prototype.toString.call(this);
	}
	get(o) {
		const a = this.getAll(o);
		if (a.length === 0) return null;
		let f = a.join(", ");
		return /^content-encoding$/i.test(o) && (f = f.toLowerCase()), f;
	}
	forEach(o, a = void 0) {
		for (const f of this.keys()) Reflect.apply(o, a, [
			this.get(f),
			f,
			this
		]);
	}
	*values() {
		for (const o of this.keys()) yield this.get(o);
	}
	*entries() {
		for (const o of this.keys()) yield [o, this.get(o)];
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	raw() {
		return [...this.keys()].reduce((o, a) => (o[a] = this.getAll(a), o), {});
	}
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return [...this.keys()].reduce((o, a) => {
			const f = this.getAll(a);
			return a === "host" ? o[a] = f[0] : o[a] = f.length > 1 ? f : f[0], o;
		}, {});
	}
};
n$1(Pr, "Headers");
var ye = Pr;
Object.defineProperties(ye.prototype, [
	"get",
	"entries",
	"forEach",
	"values"
].reduce((i, o) => (i[o] = { enumerable: true }, i), {}));
function ol(i = []) {
	return new ye(i.reduce((o, a, f, l) => (f % 2 === 0 && o.push(l.slice(f, f + 2)), o), []).filter(([o, a]) => {
		try {
			return gr(o), Fn(o, String(a)), !0;
		} catch {
			return false;
		}
	}));
}
n$1(ol, "fromRawHeaders");
var il = /* @__PURE__ */ new Set([
	301,
	302,
	303,
	307,
	308
]);
var jn = n$1((i) => il.has(i), "isRedirect");
var se = Symbol("Response internals");
var Ne = class Ne extends xe {
	constructor(o = null, a = {}) {
		super(o, a);
		const f = a.status != null ? a.status : 200, l = new ye(a.headers);
		if (o !== null && !l.has("Content-Type")) {
			const p = Ri(o, this);
			p && l.append("Content-Type", p);
		}
		this[se] = {
			type: "default",
			url: a.url,
			status: f,
			statusText: a.statusText || "",
			headers: l,
			counter: a.counter,
			highWaterMark: a.highWaterMark
		};
	}
	get type() {
		return this[se].type;
	}
	get url() {
		return this[se].url || "";
	}
	get status() {
		return this[se].status;
	}
	get ok() {
		return this[se].status >= 200 && this[se].status < 300;
	}
	get redirected() {
		return this[se].counter > 0;
	}
	get statusText() {
		return this[se].statusText;
	}
	get headers() {
		return this[se].headers;
	}
	get highWaterMark() {
		return this[se].highWaterMark;
	}
	clone() {
		return new Ne(In(this, this.highWaterMark), {
			type: this.type,
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected,
			size: this.size,
			highWaterMark: this.highWaterMark
		});
	}
	static redirect(o, a = 302) {
		if (!jn(a)) throw new RangeError("Failed to execute \"redirect\" on \"response\": Invalid status code");
		return new Ne(null, {
			headers: { location: new URL(o).toString() },
			status: a
		});
	}
	static error() {
		const o = new Ne(null, {
			status: 0,
			statusText: ""
		});
		return o[se].type = "error", o;
	}
	static json(o = void 0, a = {}) {
		const f = JSON.stringify(o);
		if (f === void 0) throw new TypeError("data is not JSON serializable");
		const l = new ye(a && a.headers);
		return l.has("content-type") || l.set("content-type", "application/json"), new Ne(f, {
			...a,
			headers: l
		});
	}
	get [Symbol.toStringTag]() {
		return "Response";
	}
};
n$1(Ne, "Response");
var le = Ne;
Object.defineProperties(le.prototype, {
	type: { enumerable: true },
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});
var al = n$1((i) => {
	if (i.search) return i.search;
	const o = i.href.length - 1, a = i.hash || (i.href[o] === "#" ? "#" : "");
	return i.href[o - a.length] === "?" ? "?" : "";
}, "getSearch");
function Ti(i, o = false) {
	return i == null || (i = new URL(i), /^(about|blob|data):$/.test(i.protocol)) ? "no-referrer" : (i.username = "", i.password = "", i.hash = "", o && (i.pathname = "", i.search = ""), i);
}
n$1(Ti, "stripURLForUseAsAReferrer");
var Ci = /* @__PURE__ */ new Set([
	"",
	"no-referrer",
	"no-referrer-when-downgrade",
	"same-origin",
	"origin",
	"strict-origin",
	"origin-when-cross-origin",
	"strict-origin-when-cross-origin",
	"unsafe-url"
]);
var sl = "strict-origin-when-cross-origin";
function ll(i) {
	if (!Ci.has(i)) throw new TypeError(`Invalid referrerPolicy: ${i}`);
	return i;
}
n$1(ll, "validateReferrerPolicy");
function ul(i) {
	if (/^(http|ws)s:$/.test(i.protocol)) return true;
	const o = i.host.replace(/(^\[)|(]$)/g, ""), a = isIP(o);
	return a === 4 && /^127\./.test(o) || a === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o) ? true : i.host === "localhost" || i.host.endsWith(".localhost") ? false : i.protocol === "file:";
}
n$1(ul, "isOriginPotentiallyTrustworthy");
function ct(i) {
	return /^about:(blank|srcdoc)$/.test(i) || i.protocol === "data:" || /^(blob|filesystem):$/.test(i.protocol) ? true : ul(i);
}
n$1(ct, "isUrlPotentiallyTrustworthy");
function fl(i, { referrerURLCallback: o, referrerOriginCallback: a } = {}) {
	if (i.referrer === "no-referrer" || i.referrerPolicy === "") return null;
	const f = i.referrerPolicy;
	if (i.referrer === "about:client") return "no-referrer";
	const l = i.referrer;
	let p = Ti(l), h = Ti(l, true);
	p.toString().length > 4096 && (p = h), o && (p = o(p)), a && (h = a(h));
	const S = new URL(i.url);
	switch (f) {
		case "no-referrer": return "no-referrer";
		case "origin": return h;
		case "unsafe-url": return p;
		case "strict-origin": return ct(p) && !ct(S) ? "no-referrer" : h.toString();
		case "strict-origin-when-cross-origin": return p.origin === S.origin ? p : ct(p) && !ct(S) ? "no-referrer" : h;
		case "same-origin": return p.origin === S.origin ? p : "no-referrer";
		case "origin-when-cross-origin": return p.origin === S.origin ? p : h;
		case "no-referrer-when-downgrade": return ct(p) && !ct(S) ? "no-referrer" : p;
		default: throw new TypeError(`Invalid referrerPolicy: ${f}`);
	}
}
n$1(fl, "determineRequestsReferrer");
function cl(i) {
	const o = (i.get("referrer-policy") || "").split(/[,\s]+/);
	let a = "";
	for (const f of o) f && Ci.has(f) && (a = f);
	return a;
}
n$1(cl, "parseReferrerPolicyFromHeader");
var $ = Symbol("Request internals");
var qt = n$1((i) => typeof i == "object" && typeof i[$] == "object", "isRequest");
var dl = deprecate(() => {}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
var vr = class vr extends xe {
	constructor(o, a = {}) {
		let f;
		if (qt(o) ? f = new URL(o.url) : (f = new URL(o), o = {}), f.username !== "" || f.password !== "") throw new TypeError(`${f} is an url with embedded credentials.`);
		let l = a.method || o.method || "GET";
		if (/^(delete|get|head|options|post|put)$/i.test(l) && (l = l.toUpperCase()), !qt(a) && "data" in a && dl(), (a.body != null || qt(o) && o.body !== null) && (l === "GET" || l === "HEAD")) throw new TypeError("Request with GET/HEAD method cannot have body");
		const p = a.body ? a.body : qt(o) && o.body !== null ? In(o) : null;
		super(p, { size: a.size || o.size || 0 });
		const h = new ye(a.headers || o.headers || {});
		if (p !== null && !h.has("Content-Type")) {
			const w = Ri(p, this);
			w && h.set("Content-Type", w);
		}
		let S = qt(o) ? o.signal : null;
		if ("signal" in a && (S = a.signal), S != null && !Ks(S)) throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
		let v = a.referrer == null ? o.referrer : a.referrer;
		if (v === "") v = "no-referrer";
		else if (v) {
			const w = new URL(v);
			v = /^about:(\/\/)?client$/.test(w) ? "client" : w;
		} else v = void 0;
		this[$] = {
			method: l,
			redirect: a.redirect || o.redirect || "follow",
			headers: h,
			parsedURL: f,
			signal: S,
			referrer: v
		}, this.follow = a.follow === void 0 ? o.follow === void 0 ? 20 : o.follow : a.follow, this.compress = a.compress === void 0 ? o.compress === void 0 ? true : o.compress : a.compress, this.counter = a.counter || o.counter || 0, this.agent = a.agent || o.agent, this.highWaterMark = a.highWaterMark || o.highWaterMark || 16384, this.insecureHTTPParser = a.insecureHTTPParser || o.insecureHTTPParser || false, this.referrerPolicy = a.referrerPolicy || o.referrerPolicy || "";
	}
	get method() {
		return this[$].method;
	}
	get url() {
		return format$1(this[$].parsedURL);
	}
	get headers() {
		return this[$].headers;
	}
	get redirect() {
		return this[$].redirect;
	}
	get signal() {
		return this[$].signal;
	}
	get referrer() {
		if (this[$].referrer === "no-referrer") return "";
		if (this[$].referrer === "client") return "about:client";
		if (this[$].referrer) return this[$].referrer.toString();
	}
	get referrerPolicy() {
		return this[$].referrerPolicy;
	}
	set referrerPolicy(o) {
		this[$].referrerPolicy = ll(o);
	}
	clone() {
		return new vr(this);
	}
	get [Symbol.toStringTag]() {
		return "Request";
	}
};
n$1(vr, "Request");
var dt = vr;
Object.defineProperties(dt.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true },
	referrer: { enumerable: true },
	referrerPolicy: { enumerable: true }
});
var hl = n$1((i) => {
	const { parsedURL: o } = i[$], a = new ye(i[$].headers);
	a.has("Accept") || a.set("Accept", "*/*");
	let f = null;
	if (i.body === null && /^(post|put)$/i.test(i.method) && (f = "0"), i.body !== null) {
		const S = rl(i);
		typeof S == "number" && !Number.isNaN(S) && (f = String(S));
	}
	f && a.set("Content-Length", f), i.referrerPolicy === "" && (i.referrerPolicy = sl), i.referrer && i.referrer !== "no-referrer" ? i[$].referrer = fl(i) : i[$].referrer = "no-referrer", i[$].referrer instanceof URL && a.set("Referer", i.referrer), a.has("User-Agent") || a.set("User-Agent", "node-fetch"), i.compress && !a.has("Accept-Encoding") && a.set("Accept-Encoding", "gzip, deflate, br");
	let { agent: l } = i;
	typeof l == "function" && (l = l(o));
	const p = al(o);
	return {
		parsedURL: o,
		options: {
			path: o.pathname + p,
			method: i.method,
			headers: a[Symbol.for("nodejs.util.inspect.custom")](),
			insecureHTTPParser: i.insecureHTTPParser,
			agent: l
		}
	};
}, "getNodeRequestOptions");
var Hn = class Hn extends ft {
	constructor(o, a = "aborted") {
		super(o, a);
	}
};
n$1(Hn, "AbortError");
var _r = Hn;
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */ var Ln;
var Pi;
function pl() {
	if (Pi) return Ln;
	if (Pi = 1, !globalThis.DOMException) try {
		const { MessageChannel: i } = __require("worker_threads"), o = new i().port1, a = /* @__PURE__ */ new ArrayBuffer();
		o.postMessage(a, [a, a]);
	} catch (i) {
		i.constructor.name === "DOMException" && (globalThis.DOMException = i.constructor);
	}
	return Ln = globalThis.DOMException, Ln;
}
n$1(pl, "requireNodeDomexception");
var ml = f(pl()), { stat: $n } = promises;
n$1((i, o) => vi(statSync(i), i, o), "blobFromSync");
n$1((i, o) => $n(i).then((a) => vi(a, i, o)), "blobFrom");
n$1((i, o) => $n(i).then((a) => Ei(a, i, o)), "fileFrom");
n$1((i, o) => Ei(statSync(i), i, o), "fileFromSync");
var vi = n$1((i, o, a = "") => new ut([new Sr({
	path: o,
	size: i.size,
	lastModified: i.mtimeMs,
	start: 0
})], { type: a }), "fromBlob"), Ei = n$1((i, o, a = "") => new qn([new Sr({
	path: o,
	size: i.size,
	lastModified: i.mtimeMs,
	start: 0
})], basename(o), {
	type: a,
	lastModified: i.mtimeMs
}), "fromFile"), Er = class Er {
	constructor(o) {
		be(this, He);
		be(this, Ve);
		X(this, He, o.path), X(this, Ve, o.start), this.size = o.size, this.lastModified = o.lastModified;
	}
	slice(o, a) {
		return new Er({
			path: O(this, He),
			lastModified: this.lastModified,
			size: a - o,
			start: O(this, Ve) + o
		});
	}
	async *stream() {
		const { mtimeMs: o } = await $n(O(this, He));
		if (o > this.lastModified) throw new ml("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
		yield* createReadStream(O(this, He), {
			start: O(this, Ve),
			end: O(this, Ve) + this.size - 1
		});
	}
	get [Symbol.toStringTag]() {
		return "Blob";
	}
};
He = /* @__PURE__ */ new WeakMap(), Ve = /* @__PURE__ */ new WeakMap(), n$1(Er, "BlobDataItem");
var Sr = Er;
var wl = /* @__PURE__ */ new Set([
	"data:",
	"http:",
	"https:"
]);
async function Ai(i, o) {
	return new Promise((a, f) => {
		const l = new dt(i, o), { parsedURL: p, options: h } = hl(l);
		if (!wl.has(p.protocol)) throw new TypeError(`node-fetch cannot load ${i}. URL scheme "${p.protocol.replace(/:$/, "")}" is not supported.`);
		if (p.protocol === "data:") {
			const g = Us(l.url);
			a(new le(g, { headers: { "Content-Type": g.typeFull } }));
			return;
		}
		const S = (p.protocol === "https:" ? zs : Bt).request, { signal: v } = l;
		let w = null;
		const A = n$1(() => {
			const g = new _r("The operation was aborted.");
			f(g), l.body && l.body instanceof me.Readable && l.body.destroy(g), w && w.body && w.body.emit("error", g);
		}, "abort");
		if (v && v.aborted) {
			A();
			return;
		}
		const T = n$1(() => {
			A(), q();
		}, "abortAndFinalize"), b = S(p.toString(), h);
		v && v.addEventListener("abort", T);
		const q = n$1(() => {
			b.abort(), v && v.removeEventListener("abort", T);
		}, "finalize");
		b.on("error", (g) => {
			f(new G(`request to ${l.url} failed, reason: ${g.message}`, "system", g)), q();
		}), Rl(b, (g) => {
			w && w.body && w.body.destroy(g);
		}), process.version < "v14" && b.on("socket", (g) => {
			let V;
			g.prependListener("end", () => {
				V = g._eventsCount;
			}), g.prependListener("close", (I) => {
				if (w && V < g._eventsCount && !I) {
					const F = /* @__PURE__ */ new Error("Premature close");
					F.code = "ERR_STREAM_PREMATURE_CLOSE", w.body.emit("error", F);
				}
			});
		}), b.on("response", (g) => {
			b.setTimeout(0);
			const V = ol(g.rawHeaders);
			if (jn(g.statusCode)) {
				const z = V.get("Location");
				let j = null;
				try {
					j = z === null ? null : new URL(z, l.url);
				} catch {
					if (l.redirect !== "manual") {
						f(new G(`uri requested responds with an invalid redirect URL: ${z}`, "invalid-redirect")), q();
						return;
					}
				}
				switch (l.redirect) {
					case "error":
						f(new G(`uri requested responds with a redirect, redirect mode is set to error: ${l.url}`, "no-redirect")), q();
						return;
					case "manual": break;
					case "follow": {
						if (j === null) break;
						if (l.counter >= l.follow) {
							f(new G(`maximum redirect reached at: ${l.url}`, "max-redirect")), q();
							return;
						}
						const U = {
							headers: new ye(l.headers),
							follow: l.follow,
							counter: l.counter + 1,
							agent: l.agent,
							compress: l.compress,
							method: l.method,
							body: In(l),
							signal: l.signal,
							size: l.size,
							referrer: l.referrer,
							referrerPolicy: l.referrerPolicy
						};
						if (!Js(l.url, j) || !Xs(l.url, j)) for (const jt of [
							"authorization",
							"www-authenticate",
							"cookie",
							"cookie2"
						]) U.headers.delete(jt);
						if (g.statusCode !== 303 && l.body && o.body instanceof me.Readable) {
							f(new G("Cannot follow redirect with body being a readable stream", "unsupported-redirect")), q();
							return;
						}
						(g.statusCode === 303 || (g.statusCode === 301 || g.statusCode === 302) && l.method === "POST") && (U.method = "GET", U.body = void 0, U.headers.delete("content-length"));
						const D = cl(V);
						D && (U.referrerPolicy = D), a(Ai(new dt(j, U))), q();
						return;
					}
					default: return f(/* @__PURE__ */ new TypeError(`Redirect option '${l.redirect}' is not a valid value of RequestRedirect`));
				}
			}
			v && g.once("end", () => {
				v.removeEventListener("abort", T);
			});
			let I = pipeline(g, new PassThrough(), (z) => {
				z && f(z);
			});
			process.version < "v12.10" && g.on("aborted", T);
			const F = {
				url: l.url,
				status: g.statusCode,
				statusText: g.statusMessage,
				headers: V,
				size: l.size,
				counter: l.counter,
				highWaterMark: l.highWaterMark
			}, Q = V.get("Content-Encoding");
			if (!l.compress || l.method === "HEAD" || Q === null || g.statusCode === 204 || g.statusCode === 304) {
				w = new le(I, F), a(w);
				return;
			}
			const ge = {
				flush: st.Z_SYNC_FLUSH,
				finishFlush: st.Z_SYNC_FLUSH
			};
			if (Q === "gzip" || Q === "x-gzip") {
				I = pipeline(I, st.createGunzip(ge), (z) => {
					z && f(z);
				}), w = new le(I, F), a(w);
				return;
			}
			if (Q === "deflate" || Q === "x-deflate") {
				const z = pipeline(g, new PassThrough(), (j) => {
					j && f(j);
				});
				z.once("data", (j) => {
					(j[0] & 15) === 8 ? I = pipeline(I, st.createInflate(), (U) => {
						U && f(U);
					}) : I = pipeline(I, st.createInflateRaw(), (U) => {
						U && f(U);
					}), w = new le(I, F), a(w);
				}), z.once("end", () => {
					w || (w = new le(I, F), a(w));
				});
				return;
			}
			if (Q === "br") {
				I = pipeline(I, st.createBrotliDecompress(), (z) => {
					z && f(z);
				}), w = new le(I, F), a(w);
				return;
			}
			w = new le(I, F), a(w);
		}), nl(b, l).catch(f);
	});
}
n$1(Ai, "fetch$1");
function Rl(i, o) {
	const a = Buffer$1.from(`0\r
\r
`);
	let f = false, l = false, p;
	i.on("response", (h) => {
		const { headers: S } = h;
		f = S["transfer-encoding"] === "chunked" && !S["content-length"];
	}), i.on("socket", (h) => {
		const S = n$1(() => {
			if (f && !l) {
				const w = /* @__PURE__ */ new Error("Premature close");
				w.code = "ERR_STREAM_PREMATURE_CLOSE", o(w);
			}
		}, "onSocketClose"), v = n$1((w) => {
			l = Buffer$1.compare(w.slice(-5), a) === 0, !l && p && (l = Buffer$1.compare(p.slice(-3), a.slice(0, 3)) === 0 && Buffer$1.compare(w.slice(-2), a.slice(3)) === 0), p = w;
		}, "onData");
		h.prependListener("close", S), h.on("data", v), i.on("close", () => {
			h.removeListener("close", S), h.removeListener("data", v);
		});
	});
}
n$1(Rl, "fixResponseChunkedTransferBadEnding");
var Bi = /* @__PURE__ */ new WeakMap();
var Dn = /* @__PURE__ */ new WeakMap();
function W(i) {
	const o = Bi.get(i);
	return console.assert(o != null, "'this' is expected an Event object, but got", i), o;
}
n$1(W, "pd");
function ki(i) {
	if (i.passiveListener != null) {
		typeof console < "u" && typeof console.error == "function" && console.error("Unable to preventDefault inside passive event listener invocation.", i.passiveListener);
		return;
	}
	i.event.cancelable && (i.canceled = true, typeof i.event.preventDefault == "function" && i.event.preventDefault());
}
n$1(ki, "setCancelFlag");
function ht(i, o) {
	Bi.set(this, {
		eventTarget: i,
		event: o,
		eventPhase: 2,
		currentTarget: i,
		canceled: false,
		stopped: false,
		immediateStopped: false,
		passiveListener: null,
		timeStamp: o.timeStamp || Date.now()
	}), Object.defineProperty(this, "isTrusted", {
		value: false,
		enumerable: true
	});
	const a = Object.keys(o);
	for (let f = 0; f < a.length; ++f) {
		const l = a[f];
		l in this || Object.defineProperty(this, l, Wi(l));
	}
}
n$1(ht, "Event"), ht.prototype = {
	get type() {
		return W(this).event.type;
	},
	get target() {
		return W(this).eventTarget;
	},
	get currentTarget() {
		return W(this).currentTarget;
	},
	composedPath() {
		const i = W(this).currentTarget;
		return i == null ? [] : [i];
	},
	get NONE() {
		return 0;
	},
	get CAPTURING_PHASE() {
		return 1;
	},
	get AT_TARGET() {
		return 2;
	},
	get BUBBLING_PHASE() {
		return 3;
	},
	get eventPhase() {
		return W(this).eventPhase;
	},
	stopPropagation() {
		const i = W(this);
		i.stopped = true, typeof i.event.stopPropagation == "function" && i.event.stopPropagation();
	},
	stopImmediatePropagation() {
		const i = W(this);
		i.stopped = true, i.immediateStopped = true, typeof i.event.stopImmediatePropagation == "function" && i.event.stopImmediatePropagation();
	},
	get bubbles() {
		return !!W(this).event.bubbles;
	},
	get cancelable() {
		return !!W(this).event.cancelable;
	},
	preventDefault() {
		ki(W(this));
	},
	get defaultPrevented() {
		return W(this).canceled;
	},
	get composed() {
		return !!W(this).event.composed;
	},
	get timeStamp() {
		return W(this).timeStamp;
	},
	get srcElement() {
		return W(this).eventTarget;
	},
	get cancelBubble() {
		return W(this).stopped;
	},
	set cancelBubble(i) {
		if (!i) return;
		const o = W(this);
		o.stopped = true, typeof o.event.cancelBubble == "boolean" && (o.event.cancelBubble = true);
	},
	get returnValue() {
		return !W(this).canceled;
	},
	set returnValue(i) {
		i || ki(W(this));
	},
	initEvent() {}
}, Object.defineProperty(ht.prototype, "constructor", {
	value: ht,
	configurable: true,
	writable: true
});
function Wi(i) {
	return {
		get() {
			return W(this).event[i];
		},
		set(o) {
			W(this).event[i] = o;
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Wi, "defineRedirectDescriptor");
function Tl(i) {
	return {
		value() {
			const o = W(this).event;
			return o[i].apply(o, arguments);
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Tl, "defineCallDescriptor");
function Cl(i, o) {
	const a = Object.keys(o);
	if (a.length === 0) return i;
	function f(l, p) {
		i.call(this, l, p);
	}
	n$1(f, "CustomEvent"), f.prototype = Object.create(i.prototype, { constructor: {
		value: f,
		configurable: true,
		writable: true
	} });
	for (let l = 0; l < a.length; ++l) {
		const p = a[l];
		if (!(p in i.prototype)) {
			const S = typeof Object.getOwnPropertyDescriptor(o, p).value == "function";
			Object.defineProperty(f.prototype, p, S ? Tl(p) : Wi(p));
		}
	}
	return f;
}
n$1(Cl, "defineWrapper");
function qi(i) {
	if (i == null || i === Object.prototype) return ht;
	let o = Dn.get(i);
	return o ?? (o = Cl(qi(Object.getPrototypeOf(i)), i), Dn.set(i, o)), o;
}
n$1(qi, "getWrapper");
function Pl(i, o) {
	return new (qi(Object.getPrototypeOf(o)))(i, o);
}
n$1(Pl, "wrapEvent");
function vl(i) {
	return W(i).immediateStopped;
}
n$1(vl, "isStopped");
function El(i, o) {
	W(i).eventPhase = o;
}
n$1(El, "setEventPhase");
function Al(i, o) {
	W(i).currentTarget = o;
}
n$1(Al, "setCurrentTarget");
function Oi(i, o) {
	W(i).passiveListener = o;
}
n$1(Oi, "setPassiveListener");
var zi = /* @__PURE__ */ new WeakMap();
var Ii = 1;
var Fi = 2;
var wr = 3;
function Rr(i) {
	return i !== null && typeof i == "object";
}
n$1(Rr, "isObject");
function Ot(i) {
	const o = zi.get(i);
	if (o == null) throw new TypeError("'this' is expected an EventTarget object, but got another value.");
	return o;
}
n$1(Ot, "getListeners");
function Bl(i) {
	return {
		get() {
			let a = Ot(this).get(i);
			for (; a != null;) {
				if (a.listenerType === wr) return a.listener;
				a = a.next;
			}
			return null;
		},
		set(o) {
			typeof o != "function" && !Rr(o) && (o = null);
			const a = Ot(this);
			let f = null, l = a.get(i);
			for (; l != null;) l.listenerType === wr ? f !== null ? f.next = l.next : l.next !== null ? a.set(i, l.next) : a.delete(i) : f = l, l = l.next;
			if (o !== null) {
				const p = {
					listener: o,
					listenerType: wr,
					passive: false,
					once: false,
					next: null
				};
				f === null ? a.set(i, p) : f.next = p;
			}
		},
		configurable: true,
		enumerable: true
	};
}
n$1(Bl, "defineEventAttributeDescriptor");
function ji(i, o) {
	Object.defineProperty(i, `on${o}`, Bl(o));
}
n$1(ji, "defineEventAttribute");
function Li(i) {
	function o() {
		Pe.call(this);
	}
	n$1(o, "CustomEventTarget"), o.prototype = Object.create(Pe.prototype, { constructor: {
		value: o,
		configurable: true,
		writable: true
	} });
	for (let a = 0; a < i.length; ++a) ji(o.prototype, i[a]);
	return o;
}
n$1(Li, "defineCustomEventTarget");
function Pe() {
	if (this instanceof Pe) {
		zi.set(this, /* @__PURE__ */ new Map());
		return;
	}
	if (arguments.length === 1 && Array.isArray(arguments[0])) return Li(arguments[0]);
	if (arguments.length > 0) {
		const i = new Array(arguments.length);
		for (let o = 0; o < arguments.length; ++o) i[o] = arguments[o];
		return Li(i);
	}
	throw new TypeError("Cannot call a class as a function");
}
n$1(Pe, "EventTarget"), Pe.prototype = {
	addEventListener(i, o, a) {
		if (o == null) return;
		if (typeof o != "function" && !Rr(o)) throw new TypeError("'listener' should be a function or an object.");
		const f = Ot(this), l = Rr(a), h = (l ? !!a.capture : !!a) ? Ii : Fi, S = {
			listener: o,
			listenerType: h,
			passive: l && !!a.passive,
			once: l && !!a.once,
			next: null
		};
		let v = f.get(i);
		if (v === void 0) {
			f.set(i, S);
			return;
		}
		let w = null;
		for (; v != null;) {
			if (v.listener === o && v.listenerType === h) return;
			w = v, v = v.next;
		}
		w.next = S;
	},
	removeEventListener(i, o, a) {
		if (o == null) return;
		const f = Ot(this), p = (Rr(a) ? !!a.capture : !!a) ? Ii : Fi;
		let h = null, S = f.get(i);
		for (; S != null;) {
			if (S.listener === o && S.listenerType === p) {
				h !== null ? h.next = S.next : S.next !== null ? f.set(i, S.next) : f.delete(i);
				return;
			}
			h = S, S = S.next;
		}
	},
	dispatchEvent(i) {
		if (i == null || typeof i.type != "string") throw new TypeError("\"event.type\" should be a string.");
		const o = Ot(this), a = i.type;
		let f = o.get(a);
		if (f == null) return true;
		const l = Pl(this, i);
		let p = null;
		for (; f != null;) {
			if (f.once ? p !== null ? p.next = f.next : f.next !== null ? o.set(a, f.next) : o.delete(a) : p = f, Oi(l, f.passive ? f.listener : null), typeof f.listener == "function") try {
				f.listener.call(this, l);
			} catch (h) {
				typeof console < "u" && typeof console.error == "function" && console.error(h);
			}
			else f.listenerType !== wr && typeof f.listener.handleEvent == "function" && f.listener.handleEvent(l);
			if (vl(l)) break;
			f = f.next;
		}
		return Oi(l, null), El(l, 0), Al(l, null), !l.defaultPrevented;
	}
}, Object.defineProperty(Pe.prototype, "constructor", {
	value: Pe,
	configurable: true,
	writable: true
});
var Vn = class Vn extends Pe {
	constructor() {
		throw super(), /* @__PURE__ */ new TypeError("AbortSignal cannot be constructed directly");
	}
	get aborted() {
		const o = Tr.get(this);
		if (typeof o != "boolean") throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this === null ? "null" : typeof this}`);
		return o;
	}
};
n$1(Vn, "AbortSignal");
var pt = Vn;
ji(pt.prototype, "abort");
function kl() {
	const i = Object.create(pt.prototype);
	return Pe.call(i), Tr.set(i, false), i;
}
n$1(kl, "createAbortSignal");
function Wl(i) {
	Tr.get(i) === false && (Tr.set(i, true), i.dispatchEvent({ type: "abort" }));
}
n$1(Wl, "abortSignal");
var Tr = /* @__PURE__ */ new WeakMap();
Object.defineProperties(pt.prototype, { aborted: { enumerable: true } }), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(pt.prototype, Symbol.toStringTag, {
	configurable: true,
	value: "AbortSignal"
});
var Mn = (gt = class {
	constructor() {
		$i.set(this, kl());
	}
	get signal() {
		return Di(this);
	}
	abort() {
		Wl(Di(this));
	}
}, n$1(gt, "AbortController"), gt);
var $i = /* @__PURE__ */ new WeakMap();
function Di(i) {
	const o = $i.get(i);
	if (o == null) throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i === null ? "null" : typeof i}`);
	return o;
}
n$1(Di, "getSignal"), Object.defineProperties(Mn.prototype, {
	signal: { enumerable: true },
	abort: { enumerable: true }
}), typeof Symbol == "function" && typeof Symbol.toStringTag == "symbol" && Object.defineProperty(Mn.prototype, Symbol.toStringTag, {
	configurable: true,
	value: "AbortController"
});
var ql = Object.defineProperty;
var Ol = n$1((i, o) => ql(i, "name", {
	value: o,
	configurable: true
}), "e");
var Mi = Ai;
Ui();
function Ui() {
	!globalThis.process?.versions?.node && !globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN && console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");
}
n$1(Ui, "s"), Ol(Ui, "checkNodeEnvironment");
//#endregion
//#region node_modules/.pnpm/node-fetch-native@1.6.7/node_modules/node-fetch-native/dist/index.mjs
var o = !!globalThis.process?.env?.FORCE_NODE_FETCH;
var r = !o && globalThis.fetch || Mi;
var n = !o && globalThis.Headers || ye;
var T = !o && globalThis.AbortController || Mn;
//#endregion
//#region node_modules/.pnpm/ofetch@1.5.1/node_modules/ofetch/dist/shared/ofetch.CWycOUEr.mjs
var FetchError = class extends Error {
	constructor(message, opts) {
		super(message, opts);
		this.name = "FetchError";
		if (opts?.cause && !this.cause) this.cause = opts.cause;
	}
};
function createFetchError(ctx) {
	const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
	const method = ctx.request?.method || ctx.options?.method || "GET";
	const url = ctx.request?.url || String(ctx.request) || "/";
	const fetchError = new FetchError(`${`[${method}] ${JSON.stringify(url)}`}: ${ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>"}${errorMessage ? ` ${errorMessage}` : ""}`, ctx.error ? { cause: ctx.error } : void 0);
	for (const key of [
		"request",
		"options",
		"response"
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx[key];
	} });
	for (const [key, refKey] of [
		["data", "_data"],
		["status", "status"],
		["statusCode", "status"],
		["statusText", "statusText"],
		["statusMessage", "statusText"]
	]) Object.defineProperty(fetchError, key, { get() {
		return ctx.response && ctx.response[refKey];
	} });
	return fetchError;
}
var payloadMethods = new Set(Object.freeze([
	"PATCH",
	"POST",
	"PUT",
	"DELETE"
]));
function isPayloadMethod(method = "GET") {
	return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	if (value instanceof FormData || value instanceof URLSearchParams) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
var textTypes = /* @__PURE__ */ new Set([
	"image/svg",
	"application/xml",
	"application/xhtml",
	"application/html"
]);
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
	if (!_contentType) return "json";
	const contentType = _contentType.split(";").shift() || "";
	if (JSON_RE.test(contentType)) return "json";
	if (contentType === "text/event-stream") return "stream";
	if (textTypes.has(contentType) || contentType.startsWith("text/")) return "text";
	return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
	const headers = mergeHeaders(input?.headers ?? request?.headers, defaults?.headers, Headers);
	let query;
	if (defaults?.query || defaults?.params || input?.params || input?.query) query = {
		...defaults?.params,
		...defaults?.query,
		...input?.params,
		...input?.query
	};
	return {
		...defaults,
		...input,
		query,
		params: query,
		headers
	};
}
function mergeHeaders(input, defaults, Headers) {
	if (!defaults) return new Headers(input);
	const headers = new Headers(defaults);
	if (input) for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) headers.set(key, value);
	return headers;
}
async function callHooks(context, hooks) {
	if (hooks) {
		if (Array.isArray(hooks)) for (const hook of hooks) await hook(context);
		else await hooks(context);
	}
}
var retryStatusCodes = /* @__PURE__ */ new Set([
	408,
	409,
	425,
	429,
	500,
	502,
	503,
	504
]);
var nullBodyResponses = /* @__PURE__ */ new Set([
	101,
	204,
	205,
	304
]);
function createFetch(globalOptions = {}) {
	const { fetch = globalThis.fetch, Headers = globalThis.Headers, AbortController = globalThis.AbortController } = globalOptions;
	async function onError(context) {
		const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
		if (context.options.retry !== false && !isAbort) {
			let retries;
			if (typeof context.options.retry === "number") retries = context.options.retry;
			else retries = isPayloadMethod(context.options.method) ? 0 : 1;
			const responseCode = context.response && context.response.status || 500;
			if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
				const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
				if (retryDelay > 0) await new Promise((resolve) => setTimeout(resolve, retryDelay));
				return $fetchRaw(context.request, {
					...context.options,
					retry: retries - 1
				});
			}
		}
		const error = createFetchError(context);
		if (Error.captureStackTrace) Error.captureStackTrace(error, $fetchRaw);
		throw error;
	}
	const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
		const context = {
			request: _request,
			options: resolveFetchOptions(_request, _options, globalOptions.defaults, Headers),
			response: void 0,
			error: void 0
		};
		if (context.options.method) context.options.method = context.options.method.toUpperCase();
		if (context.options.onRequest) {
			await callHooks(context, context.options.onRequest);
			if (!(context.options.headers instanceof Headers)) context.options.headers = new Headers(context.options.headers || {});
		}
		if (typeof context.request === "string") {
			if (context.options.baseURL) context.request = withBase(context.request, context.options.baseURL);
			if (context.options.query) {
				context.request = withQuery(context.request, context.options.query);
				delete context.options.query;
			}
			if ("query" in context.options) delete context.options.query;
			if ("params" in context.options) delete context.options.params;
		}
		if (context.options.body && isPayloadMethod(context.options.method)) {
			if (isJSONSerializable(context.options.body)) {
				const contentType = context.options.headers.get("content-type");
				if (typeof context.options.body !== "string") context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(context.options.body).toString() : JSON.stringify(context.options.body);
				if (!contentType) context.options.headers.set("content-type", "application/json");
				if (!context.options.headers.has("accept")) context.options.headers.set("accept", "application/json");
			} else if ("pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || typeof context.options.body.pipe === "function") {
				if (!("duplex" in context.options)) context.options.duplex = "half";
			}
		}
		let abortTimeout;
		if (!context.options.signal && context.options.timeout) {
			const controller = new AbortController();
			abortTimeout = setTimeout(() => {
				const error = /* @__PURE__ */ new Error("[TimeoutError]: The operation was aborted due to timeout");
				error.name = "TimeoutError";
				error.code = 23;
				controller.abort(error);
			}, context.options.timeout);
			context.options.signal = controller.signal;
		}
		try {
			context.response = await fetch(context.request, context.options);
		} catch (error) {
			context.error = error;
			if (context.options.onRequestError) await callHooks(context, context.options.onRequestError);
			return await onError(context);
		} finally {
			if (abortTimeout) clearTimeout(abortTimeout);
		}
		if ((context.response.body || context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD") {
			const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
			switch (responseType) {
				case "json": {
					const data = await context.response.text();
					const parseFunction = context.options.parseResponse || destr;
					context.response._data = parseFunction(data);
					break;
				}
				case "stream":
					context.response._data = context.response.body || context.response._bodyInit;
					break;
				default: context.response._data = await context.response[responseType]();
			}
		}
		if (context.options.onResponse) await callHooks(context, context.options.onResponse);
		if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
			if (context.options.onResponseError) await callHooks(context, context.options.onResponseError);
			return await onError(context);
		}
		return context.response;
	};
	const $fetch = async function $fetch2(request, options) {
		return (await $fetchRaw(request, options))._data;
	};
	$fetch.raw = $fetchRaw;
	$fetch.native = (...args) => fetch(...args);
	$fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
		...globalOptions,
		...customGlobalOptions,
		defaults: {
			...globalOptions.defaults,
			...customGlobalOptions.defaults,
			...defaultOptions
		}
	});
	return $fetch;
}
//#endregion
//#region node_modules/.pnpm/ofetch@1.5.1/node_modules/ofetch/dist/node.mjs
function createNodeFetch() {
	if (!JSON.parse(process.env.FETCH_KEEP_ALIVE || "false")) return r;
	const agentOptions = { keepAlive: true };
	const httpAgent = new Bt.Agent(agentOptions);
	const httpsAgent = new zs.Agent(agentOptions);
	const nodeFetchOptions = { agent(parsedURL) {
		return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
	} };
	return function nodeFetchWithKeepAlive(input, init) {
		return r(input, {
			...nodeFetchOptions,
			...init
		});
	};
}
var $fetch$2 = createFetch({
	fetch: globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch(),
	Headers: globalThis.Headers || n,
	AbortController: globalThis.AbortController || T
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch$2.create({ baseURL: baseURL() });
var $fetch = globalThis.$fetch;
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$2 = defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray$1(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = () => ({});
//#endregion
//#region node_modules/.pnpm/vue-router@5.4.0_@vue+compiler-sfc@3.5.44_esbuild@0.28.2_rolldown@1.2.14_rollup@4.64.7_vite@8_7vihob4hvv5x7q25qt5cy355xq/node_modules/vue-router/dist/vue-router.js
/*!
* vue-router v5.4.0
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
/**
* Creates an in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
* It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
*
* @param base - Base applied to all urls, defaults to '/'
* @returns a history object that can be passed to the router constructor
*/
function createMemoryHistory(base = "") {
	let listeners = [];
	let queue = [["", {}]];
	let position = 0;
	base = normalizeBase(base);
	function setLocation(location, state = {}) {
		position++;
		if (position !== queue.length) queue.splice(position);
		queue.push([location, state]);
	}
	function triggerListeners(to, from, { direction, delta }) {
		const info = {
			direction,
			delta,
			type: "pop"
		};
		for (const callback of listeners) callback(to, from, info);
	}
	const routerHistory = {
		location: "",
		state: {},
		base,
		createHref: createHref.bind(null, base),
		replace(to, state) {
			queue.splice(position--, 1);
			setLocation(to, state);
		},
		push(to, state) {
			setLocation(to, state);
		},
		listen(callback) {
			listeners.push(callback);
			return () => {
				const index = listeners.indexOf(callback);
				if (index > -1) listeners.splice(index, 1);
			};
		},
		destroy() {
			listeners = [];
			queue = [["", {}]];
			position = 0;
		},
		go(delta, shouldTrigger = true) {
			const from = this.location;
			const direction = delta < 0 ? "back" : "forward";
			position = Math.max(0, Math.min(position + delta, queue.length - 1));
			if (shouldTrigger) triggerListeners(this.location, from, {
				direction,
				delta
			});
		}
	};
	Object.defineProperty(routerHistory, "location", {
		enumerable: true,
		get: () => queue[position][0]
	});
	Object.defineProperty(routerHistory, "state", {
		enumerable: true,
		get: () => queue[position][1]
	});
	return routerHistory;
}
var ROOT_TOKEN = {
	type: 0,
	value: ""
};
var VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
	if (!path) return [[]];
	if (path === "/") return [[ROOT_TOKEN]];
	if (!isAbsolutePath(path)) throw new Error(`Invalid path "${path}"`);
	function crash(message) {
		throw new Error(`ERR (${state})/"${buffer}": ${message}`);
	}
	let state = 0;
	let previousState = state;
	const tokens = [];
	let segment;
	function finalizeSegment() {
		if (segment) tokens.push(segment);
		segment = [];
	}
	let i = 0;
	let char;
	let buffer = "";
	let customRe = "";
	function consumeBuffer() {
		if (!buffer) return;
		if (state === 0) segment.push({
			type: 0,
			value: buffer
		});
		else if (state === 1 || state === 2 || state === 3) {
			if (segment.length > 1 && (char === "*" || char === "+")) crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
			segment.push({
				type: 1,
				value: buffer,
				regexp: customRe,
				repeatable: char === "*" || char === "+",
				optional: char === "*" || char === "?"
			});
		} else crash("Invalid state to consume buffer");
		buffer = "";
	}
	function addCharToBuffer() {
		buffer += char;
	}
	while (i < path.length) {
		char = path[i++];
		switch (state) {
			case 0:
				if (char === "\\") {
					previousState = state;
					state = 4;
				} else if (char === "/") {
					if (buffer) consumeBuffer();
					finalizeSegment();
				} else if (char === ":") {
					consumeBuffer();
					state = 1;
				} else addCharToBuffer();
				break;
			case 4:
				addCharToBuffer();
				state = previousState;
				break;
			case 1:
				if (char === "(") state = 2;
				else if (VALID_PARAM_RE.test(char)) addCharToBuffer();
				else {
					consumeBuffer();
					state = 0;
					if (char !== "*" && char !== "?" && char !== "+") i--;
				}
				break;
			case 2:
				if (char === ")") {
					if (customRe[customRe.length - 1] == "\\") customRe = customRe.slice(0, -1) + char;
					else state = 3;
				} else customRe += char;
				break;
			case 3:
				consumeBuffer();
				state = 0;
				if (char !== "*" && char !== "?" && char !== "+") i--;
				customRe = "";
				break;
			default: crash("Unknown state");
		}
	}
	if (state === 2) crash(`Unfinished custom RegExp for param "${buffer}"`);
	consumeBuffer();
	finalizeSegment();
	return tokens;
}
var BASE_PARAM_PATTERN = "[^/]+?";
var BASE_PATH_PARSER_OPTIONS = {
	sensitive: false,
	strict: false,
	start: true,
	end: true
};
var REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
/**
* Creates a path parser from an array of Segments (a segment is an array of Tokens)
*
* @param segments - array of segments returned by tokenizePath
* @param extraOptions - optional options for the regexp
* @returns a PathParser
*/
function tokensToParser(segments, extraOptions) {
	const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
	const score = [];
	let pattern = options.start ? "^" : "";
	const keys = [];
	for (const segment of segments) {
		const segmentScores = segment.length ? [] : [90];
		if (options.strict && !segment.length) pattern += "/";
		for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
			const token = segment[tokenIndex];
			let subSegmentScore = 40 + (options.sensitive ? .25 : 0);
			if (token.type === 0) {
				if (!tokenIndex) pattern += "/";
				pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
				subSegmentScore += 40;
			} else if (token.type === 1) {
				const { value, repeatable, optional, regexp } = token;
				keys.push({
					name: value,
					repeatable,
					optional
				});
				const re = regexp ? regexp : BASE_PARAM_PATTERN;
				if (re !== BASE_PARAM_PATTERN) {
					subSegmentScore += 10;
					try {
						new RegExp(`(${re})`);
					} catch (err) {
						throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` + err.message);
					}
				}
				let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
				if (!tokenIndex) subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
				if (optional) subPattern += "?";
				pattern += subPattern;
				subSegmentScore += 20;
				if (optional) subSegmentScore += -8;
				if (repeatable) subSegmentScore += -20;
				if (re === ".*") subSegmentScore += -50;
			}
			segmentScores.push(subSegmentScore);
		}
		score.push(segmentScores);
	}
	if (options.strict && options.end) {
		const i = score.length - 1;
		score[i][score[i].length - 1] += .7000000000000001;
	}
	if (!options.strict) pattern += "/?";
	if (options.end) pattern += "$";
	else if (options.strict && !pattern.endsWith("/")) pattern += "(?:/|$)";
	const re = new RegExp(pattern, options.sensitive ? "" : "i");
	function parse(path) {
		const match = path.match(re);
		const params = {};
		if (!match) return null;
		for (let i = 1; i < match.length; i++) {
			const value = match[i] || "";
			const key = keys[i - 1];
			params[key.name] = value && key.repeatable ? value.split("/") : value;
		}
		return params;
	}
	function stringify(params) {
		let path = "";
		let avoidDuplicatedSlash = false;
		for (const segment of segments) {
			if (!avoidDuplicatedSlash || !path.endsWith("/")) path += "/";
			avoidDuplicatedSlash = false;
			for (const token of segment) if (token.type === 0) path += token.value;
			else if (token.type === 1) {
				const { value, repeatable, optional } = token;
				const param = value in params ? params[value] : "";
				if (isArray$1(param) && !repeatable) throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
				const text = isArray$1(param) ? param.join("/") : param;
				if (!text) {
					if (optional) {
						if (segment.length < 2) {
							if (path.endsWith("/")) path = path.slice(0, -1);
							else avoidDuplicatedSlash = true;
						}
					} else throw new Error(`Missing required param "${value}"`);
				}
				path += text;
			}
		}
		return path || "/";
	}
	return {
		re,
		score,
		keys,
		parse,
		stringify
	};
}
/**
* Compares an array of numbers as used in PathParser.score and returns a
* number. This function can be used to `sort` an array
*
* @param a - first array of numbers
* @param b - second array of numbers
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
* should be sorted first
*/
function compareScoreArray(a, b) {
	let i = 0;
	while (i < a.length && i < b.length) {
		const diff = b[i] - a[i];
		if (diff) return diff;
		i++;
	}
	if (a.length < b.length) return a.length === 1 && a[0] === 80 ? -1 : 1;
	else if (a.length > b.length) return b.length === 1 && b[0] === 80 ? 1 : -1;
	return 0;
}
/**
* Compare function that can be used with `sort` to sort an array of PathParser
*
* @param a - first PathParser
* @param b - second PathParser
* @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
*/
function comparePathParserScore(a, b) {
	let i = 0;
	const aScore = a.score;
	const bScore = b.score;
	while (i < aScore.length && i < bScore.length) {
		const comp = compareScoreArray(aScore[i], bScore[i]);
		if (comp) return comp;
		i++;
	}
	if (Math.abs(bScore.length - aScore.length) === 1) {
		if (isLastScoreNegative(aScore)) return 1;
		if (isLastScoreNegative(bScore)) return -1;
	}
	return bScore.length - aScore.length;
}
/**
* This allows detecting splats at the end of a path: /home/:id(.*)*
*
* @param score - score to check
* @returns true if the last entry is negative
*/
function isLastScoreNegative(score) {
	const last = score[score.length - 1];
	return score.length > 0 && last[last.length - 1] < 0;
}
var PATH_PARSER_OPTIONS_DEFAULTS = {
	strict: false,
	end: true,
	sensitive: false
};
function createRouteRecordMatcher(record, parent, options) {
	const parser = tokensToParser(tokenizePath(record.path), options);
	const matcher = assign(parser, {
		record,
		parent,
		children: [],
		alias: []
	});
	if (parent) {
		if (!matcher.record.aliasOf === !parent.record.aliasOf) parent.children.push(matcher);
	}
	return matcher;
}
/**
* Creates a Router Matcher.
*
* @internal
* @param routes - array of initial routes
* @param globalOptions - global route options
*/
function createRouterMatcher(routes, globalOptions) {
	const matchers = [];
	const matcherMap = /* @__PURE__ */ new Map();
	globalOptions = mergeOptions(PATH_PARSER_OPTIONS_DEFAULTS, globalOptions);
	function getRecordMatcher(name) {
		return matcherMap.get(name);
	}
	function addRoute(record, parent, originalRecord) {
		const isRootAdd = !originalRecord;
		const mainNormalizedRecord = normalizeRouteRecord(record);
		mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
		const options = mergeOptions(globalOptions, record);
		const normalizedRecords = [mainNormalizedRecord];
		if ("alias" in record) {
			const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
			for (const alias of aliases) normalizedRecords.push(normalizeRouteRecord(assign({}, mainNormalizedRecord, {
				components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
				path: alias,
				aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
			})));
		}
		let matcher;
		let originalMatcher;
		for (const normalizedRecord of normalizedRecords) {
			const { path } = normalizedRecord;
			if (parent && !isAbsolutePath(path)) {
				const parentPath = parent.record.path;
				const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
				normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
			}
			matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
			if (originalRecord) originalRecord.alias.push(matcher);
			else {
				originalMatcher = originalMatcher || matcher;
				if (originalMatcher !== matcher) originalMatcher.alias.push(matcher);
				if (isRootAdd && record.name && !isAliasRecord(matcher)) removeRoute(record.name);
			}
			if (isMatchable(matcher)) insertMatcher(matcher);
			if (mainNormalizedRecord.children) {
				const children = mainNormalizedRecord.children;
				for (let i = 0; i < children.length; i++) addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
			}
			originalRecord = originalRecord || matcher;
		}
		return originalMatcher ? () => {
			removeRoute(originalMatcher);
		} : noop$1;
	}
	function removeRoute(matcherRef) {
		if (isRouteName(matcherRef)) {
			const matcher = matcherMap.get(matcherRef);
			if (matcher) {
				matcherMap.delete(matcherRef);
				matchers.splice(matchers.indexOf(matcher), 1);
				matcher.children.forEach(removeRoute);
				matcher.alias.forEach(removeRoute);
			}
		} else {
			const index = matchers.indexOf(matcherRef);
			if (index > -1) {
				matchers.splice(index, 1);
				if (matcherRef.record.name) matcherMap.delete(matcherRef.record.name);
				matcherRef.children.forEach(removeRoute);
				matcherRef.alias.forEach(removeRoute);
			}
		}
	}
	function getRoutes() {
		return matchers;
	}
	function insertMatcher(matcher) {
		const index = findInsertionIndex(matcher, matchers);
		matchers.splice(index, 0, matcher);
		if (matcher.record.name && !isAliasRecord(matcher)) matcherMap.set(matcher.record.name, matcher);
	}
	function resolve(location, currentLocation) {
		let matcher;
		let params = {};
		let path;
		let name;
		if ("name" in location && location.name) {
			matcher = matcherMap.get(location.name);
			if (!matcher) throw createRouterError(1, { location });
			name = matcher.record.name;
			params = assign(pickParams(currentLocation.params, matcher.keys.filter((k) => !k.optional).concat(matcher.parent ? matcher.parent.keys.filter((k) => k.optional) : []).map((k) => k.name)), location.params && pickParams(location.params, matcher.keys.map((k) => k.name)));
			path = matcher.stringify(params);
		} else if (location.path != null) {
			path = location.path;
			matcher = matchers.find((m) => m.re.test(path));
			if (matcher) {
				params = matcher.parse(path);
				name = matcher.record.name;
				matcher.keys.forEach((key) => {
					if (key.optional && !params[key.name]) delete params[key.name];
				});
			}
		} else {
			matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
			if (!matcher) throw createRouterError(1, {
				location,
				currentLocation
			});
			name = matcher.record.name;
			params = assign({}, currentLocation.params, location.params);
			path = matcher.stringify(params);
		}
		const matched = [];
		let parentMatcher = matcher;
		while (parentMatcher) {
			matched.unshift(parentMatcher.record);
			parentMatcher = parentMatcher.parent;
		}
		return {
			name,
			path,
			params,
			matched,
			meta: mergeMetaFields(matched)
		};
	}
	routes.forEach((route) => addRoute(route));
	function clearRoutes() {
		matchers.length = 0;
		matcherMap.clear();
	}
	return {
		addRoute,
		resolve,
		removeRoute,
		clearRoutes,
		getRoutes,
		getRecordMatcher
	};
}
/**
* Picks an object param to contain only specified keys.
*
* @param params - params object to pick from
* @param keys - keys to pick
*/
function pickParams(params, keys) {
	const newParams = {};
	for (const key of keys) if (key in params) newParams[key] = params[key];
	return newParams;
}
/**
* Normalizes a RouteRecordRaw. Creates a copy
*
* @param record
* @returns the normalized version
*/
function normalizeRouteRecord(record) {
	const normalized = {
		path: record.path,
		redirect: record.redirect,
		name: record.name,
		meta: record.meta || {},
		aliasOf: record.aliasOf,
		beforeEnter: record.beforeEnter,
		props: normalizeRecordProps(record),
		children: record.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: "components" in record ? record.components || null : record.component && { default: record.component }
	};
	Object.defineProperty(normalized, "mods", { value: {} });
	return normalized;
}
/**
* Normalize the optional `props` in a record to always be an object similar to
* components. Also accept a boolean for components.
* @param record
*/
function normalizeRecordProps(record) {
	const propsObject = {};
	const props = record.props || false;
	if ("component" in record) propsObject.default = props;
	else for (const name in record.components) propsObject[name] = typeof props === "object" ? props[name] : props;
	return propsObject;
}
/**
* Checks if a record or any of its parent is an alias
* @param record
*/
function isAliasRecord(record) {
	while (record) {
		if (record.record.aliasOf) return true;
		record = record.parent;
	}
	return false;
}
/**
* Merge meta fields of an array of records
*
* @param matched - array of matched records
*/
function mergeMetaFields(matched) {
	return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
/**
* Performs a binary search to find the correct insertion index for a new matcher.
*
* Matchers are primarily sorted by their score. If scores are tied then we also consider parent/child relationships,
* with descendants coming before ancestors. If there's still a tie, new routes are inserted after existing routes.
*
* @param matcher - new matcher to be inserted
* @param matchers - existing matchers
*/
function findInsertionIndex(matcher, matchers) {
	let lower = 0;
	let upper = matchers.length;
	while (lower !== upper) {
		const mid = lower + upper >> 1;
		if (comparePathParserScore(matcher, matchers[mid]) < 0) upper = mid;
		else lower = mid + 1;
	}
	const insertionAncestor = getInsertionAncestor(matcher);
	if (insertionAncestor) upper = matchers.lastIndexOf(insertionAncestor, upper - 1);
	return upper;
}
function getInsertionAncestor(matcher) {
	let ancestor = matcher;
	while (ancestor = ancestor.parent) if (isMatchable(ancestor) && comparePathParserScore(matcher, ancestor) === 0) return ancestor;
}
/**
* Checks if a matcher can be reachable. This means if it's possible to reach it as a route. For example, routes without
* a component, or name, or redirect, are just used to group other routes.
* @param matcher
* @param matcher.record record of the matcher
* @returns
*/
function isMatchable({ record }) {
	return !!(record.name || record.components && Object.keys(record.components).length || record.redirect);
}
/**
* Returns the internal behavior of a {@link RouterLink} without the rendering part.
*
* @param props - a `to` location and an optional `replace` flag
*/
function useLink(props) {
	const router = inject(routerKey);
	const currentRoute = inject(routeLocationKey);
	const route = computed(() => {
		const to = unref(props.to);
		return router.resolve(to);
	});
	const activeRecordIndex = computed(() => {
		const { matched } = route.value;
		const { length } = matched;
		const routeMatched = matched[length - 1];
		const currentMatched = currentRoute.matched;
		if (!routeMatched || !currentMatched.length) return -1;
		const index = currentMatched.findIndex(isSameRouteRecord$1.bind(null, routeMatched));
		if (index > -1) return index;
		const parentRecordPath = getOriginalPath(matched[length - 2]);
		return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord$1.bind(null, matched[length - 2])) : index;
	});
	const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
	const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams$1(currentRoute.params, route.value.params));
	function navigate(e = {}) {
		if (guardEvent(e)) {
			const p = router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop$1);
			if (props.viewTransition && false);
			return p;
		}
		return Promise.resolve();
	}
	/**
	* NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
	*/
	return {
		route,
		href: computed(() => route.value.href),
		isActive,
		isExactActive,
		navigate
	};
}
function preferSingleVNode(vnodes) {
	return vnodes.length === 1 ? vnodes[0] : vnodes;
}
/**
* Component to render a link that triggers a navigation on click.
*/
var RouterLink = /* @__PURE__ */ defineComponent({
	name: "RouterLink",
	compatConfig: { MODE: 3 },
	props: {
		to: {
			type: [String, Object],
			required: true
		},
		replace: Boolean,
		activeClass: String,
		exactActiveClass: String,
		custom: Boolean,
		ariaCurrentValue: {
			type: String,
			default: "page"
		},
		viewTransition: Boolean
	},
	useLink,
	setup(props, { slots }) {
		const link = reactive(useLink(props));
		const { options } = inject(routerKey);
		const elClass = computed(() => ({
			[getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
			[getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
		}));
		return () => {
			const children = slots.default && preferSingleVNode(slots.default(link));
			return props.custom ? children : h("a", {
				"aria-current": link.isExactActive ? props.ariaCurrentValue : null,
				href: link.href,
				onClick: link.navigate,
				class: elClass.value
			}, children);
		};
	}
});
function guardEvent(e) {
	if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
	if (e.defaultPrevented) return;
	if (e.button !== void 0 && e.button !== 0) return;
	if (e.currentTarget && e.currentTarget.getAttribute) {
		const target = e.currentTarget.getAttribute("target");
		if (/\b_blank\b/i.test(target)) return;
	}
	if (e.preventDefault) e.preventDefault();
	return true;
}
function includesParams(outer, inner) {
	for (const key in inner) {
		const innerValue = inner[key];
		const outerValue = outer[key];
		if (isArray$1(innerValue)) {
			if (!isArray$1(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value.valueOf() !== outerValue[i].valueOf())) return false;
		} else if (innerValue !== outerValue) return false;
	}
	return true;
}
/**
* Get the original path value of a record by following its aliasOf
* @param record
*/
function getOriginalPath(record) {
	return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
/**
* Utility class to get the active class based on defaults.
* @param propClass
* @param globalClass
* @param defaultClass
*/
var getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
var RouterViewImpl = /*#__PURE__*/ defineComponent({
	name: "RouterView",
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: "default"
		},
		route: Object
	},
	compatConfig: { MODE: 3 },
	setup(props, { attrs, slots }) {
		const injectedRoute = inject(routerViewLocationKey);
		const routeToDisplay = computed(() => props.route || injectedRoute.value);
		const injectedDepth = inject(viewDepthKey, 0);
		const depth = computed(() => {
			let initialDepth = unref(injectedDepth);
			const { matched } = routeToDisplay.value;
			let matchedRoute;
			while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) initialDepth++;
			return initialDepth;
		});
		const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
		provide(viewDepthKey, computed(() => depth.value + 1));
		provide(matchedRouteKey, matchedRouteRef);
		provide(routerViewLocationKey, routeToDisplay);
		const onRouteRenderedCallbacks = /* @__PURE__ */ new Set();
		provide(routerViewOnRouteRenderedKey, onRouteRenderedCallbacks);
		const viewRef = ref();
		let settledRoute = START_LOCATION_NORMALIZED;
		const { app } = getCurrentInstance().appContext;
		watch(() => [
			viewRef.value,
			matchedRouteRef.value,
			props.name
		], ([instance, to, name], [oldInstance, from, _oldName]) => {
			if (to) {
				to.instances[name] = instance;
				if (from && from !== to && instance && instance === oldInstance) {
					if (!to.leaveGuards.size) to.leaveGuards = from.leaveGuards;
					if (!to.updateGuards.size) to.updateGuards = from.updateGuards;
				}
			}
			if (instance && to && (!from || !isSameRouteRecord$1(to, from) || !oldInstance)) (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
		}, { flush: "post" });
		return () => {
			const route = routeToDisplay.value;
			const currentName = props.name;
			const matchedRoute = matchedRouteRef.value;
			const ViewComponent = matchedRoute && matchedRoute.components[currentName];
			if (!ViewComponent) return normalizeSlot$1(slots.default, {
				Component: ViewComponent,
				route
			});
			const routePropsOption = matchedRoute.props[currentName];
			const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
			const onVnodeUnmounted = (vnode) => {
				if (vnode.component.isUnmounted) matchedRoute.instances[currentName] = null;
			};
			const onVnodeSettled = (vnode) => nextTick(() => {
				if (settledRoute === route || routeToDisplay.value !== route || vnode.el.getRootNode() !== app._container.getRootNode()) return;
				const from = settledRoute;
				settledRoute = route;
				for (const callback of onRouteRenderedCallbacks) callback(route, from);
			});
			const component = h(ViewComponent, assign({}, routeProps, attrs, {
				onVnodeUnmounted,
				onVnodeMounted: onVnodeSettled,
				onVnodeUpdated: onVnodeSettled,
				ref: viewRef
			}));
			return normalizeSlot$1(slots.default, {
				Component: component,
				route
			}) || component;
		};
	}
});
function normalizeSlot$1(slot, data) {
	if (!slot) return null;
	const slotContent = slot(data);
	return slotContent.length === 1 ? slotContent[0] : slotContent;
}
/**
* Component to display the current route the user is at.
*/
var RouterView = RouterViewImpl;
/**
* Creates a Router instance that can be used by a Vue app.
*
* @param options - {@link RouterOptions}
*/
function createRouter(options) {
	const matcher = options.matcher || createRouterMatcher(options.routes, options);
	const parseQuery$1 = options.parseQuery || parseQuery;
	const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
	const routerHistory = options.history;
	const beforeGuards = useCallbacks();
	const beforeResolveGuards = useCallbacks();
	const afterGuards = useCallbacks();
	const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
	const routesVersion = shallowRef(0);
	let pendingLocation = START_LOCATION_NORMALIZED;
	const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
	const encodeParams = applyToParams.bind(null, encodeParam);
	const decodeParams = applyToParams.bind(null, decode);
	function addRoute(parentOrRoute, route) {
		let parent;
		let record;
		if (isRouteName(parentOrRoute)) {
			parent = matcher.getRecordMatcher(parentOrRoute);
			record = route;
		} else record = parentOrRoute;
		const removeRoute = matcher.addRoute(record, parent);
		routesVersion.value++;
		return () => {
			removeRoute();
			routesVersion.value++;
		};
	}
	function removeRoute(name) {
		const recordMatcher = matcher.getRecordMatcher(name);
		if (recordMatcher) {
			matcher.removeRoute(recordMatcher);
			routesVersion.value++;
		}
	}
	function clearRoutes() {
		matcher.clearRoutes();
		routesVersion.value++;
	}
	function getRoutes() {
		return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
	}
	function hasRoute(name) {
		return !!matcher.getRecordMatcher(name);
	}
	function resolve(rawLocation, currentLocation) {
		routesVersion.value;
		if (typeof rawLocation === "string") {
			currentLocation = currentLocation || (rawLocation.startsWith("/") ? START_LOCATION_NORMALIZED : currentRoute.value);
			const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
			const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
			const href = routerHistory.createHref(locationNormalized.fullPath);
			return assign(locationNormalized, matchedRoute, {
				params: decodeParams(matchedRoute.params),
				redirectedFrom: void 0,
				href
			});
		}
		currentLocation = assign({}, currentLocation || (rawLocation.path != null && rawLocation.path.startsWith("/") && !("name" in rawLocation && rawLocation.name) ? START_LOCATION_NORMALIZED : currentRoute.value));
		let matcherLocation;
		if (rawLocation.path != null) matcherLocation = assign({}, rawLocation, { path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path });
		else {
			const targetParams = assign({}, rawLocation.params);
			for (const key in targetParams) if (targetParams[key] == null) delete targetParams[key];
			matcherLocation = assign({}, rawLocation, { params: encodeParams(targetParams) });
			currentLocation.params = encodeParams(currentLocation.params);
		}
		const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
		const hash = rawLocation.hash || "";
		matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
		const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
			hash: encodeHash(hash),
			path: matchedRoute.path
		}));
		const href = routerHistory.createHref(fullPath);
		return assign({
			fullPath,
			hash,
			query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
		}, matchedRoute, {
			redirectedFrom: void 0,
			href
		});
	}
	function locationAsObject(to) {
		return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
	}
	function checkCanceledNavigation(to, from) {
		if (pendingLocation !== to) return createRouterError(8, {
			from,
			to
		});
	}
	function push(to) {
		return pushWithRedirect(to);
	}
	function replace(to) {
		return push(assign(locationAsObject(to), { replace: true }));
	}
	function handleRedirectRecord(to, from) {
		const lastMatched = to.matched[to.matched.length - 1];
		if (lastMatched && lastMatched.redirect) {
			const { redirect } = lastMatched;
			let newTargetLocation = typeof redirect === "function" ? redirect(to, from) : redirect;
			if (typeof newTargetLocation === "string") {
				newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
				newTargetLocation.params = {};
			}
			return assign({
				query: to.query,
				hash: to.hash,
				params: newTargetLocation.path != null ? {} : to.params
			}, newTargetLocation);
		}
	}
	function pushWithRedirect(to, redirectedFrom) {
		const targetLocation = pendingLocation = resolve(to);
		const from = currentRoute.value;
		const data = to.state;
		const force = to.force;
		const replace = to.replace === true;
		const shouldRedirect = handleRedirectRecord(targetLocation, from);
		if (shouldRedirect) return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
			state: typeof shouldRedirect === "object" ? assign({}, data, shouldRedirect.state) : data,
			force,
			replace
		}), redirectedFrom || targetLocation);
		const toLocation = targetLocation;
		toLocation.redirectedFrom = redirectedFrom;
		let failure;
		if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
			failure = createRouterError(16, {
				to: toLocation,
				from
			});
			handleScroll();
		}
		return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure) => {
			if (failure) {
				if (isNavigationFailure(failure, 2)) return pushWithRedirect(assign({ replace }, locationAsObject(failure.to), {
					state: typeof failure.to === "object" ? assign({}, data, failure.to.state) : data,
					force
				}), redirectedFrom || toLocation);
			} else failure = finalizeNavigation(toLocation, from, true, replace, data);
			triggerAfterEach(toLocation, from, failure);
			return failure;
		});
	}
	/**
	* Helper to reject and skip all navigation guards if a new navigation happened
	* @param to
	* @param from
	*/
	function checkCanceledNavigationAndReject(to, from) {
		const error = checkCanceledNavigation(to, from);
		return error ? Promise.reject(error) : Promise.resolve();
	}
	function runWithContext(fn) {
		const app = installedApps.values().next().value;
		return app && typeof app.runWithContext === "function" ? app.runWithContext(fn) : fn();
	}
	function navigate(to, from) {
		let guards;
		const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
		guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
		for (const record of leavingRecords) record.leaveGuards.forEach((guard) => {
			guards.push(guardToPromiseFn(guard, to, from));
		});
		const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
		guards.push(canceledNavigationCheck);
		return runGuardQueue(guards).then(() => {
			guards = [];
			for (const guard of beforeGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
			for (const record of updatingRecords) record.updateGuards.forEach((guard) => {
				guards.push(guardToPromiseFn(guard, to, from));
			});
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const record of enteringRecords) if (record.beforeEnter) {
				if (isArray$1(record.beforeEnter)) for (const beforeEnter of record.beforeEnter) guards.push(guardToPromiseFn(beforeEnter, to, from));
				else guards.push(guardToPromiseFn(record.beforeEnter, to, from));
			}
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			to.matched.forEach((record) => record.enterCallbacks = {});
			guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from, runWithContext);
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).then(() => {
			guards = [];
			for (const guard of beforeResolveGuards.list()) guards.push(guardToPromiseFn(guard, to, from));
			guards.push(canceledNavigationCheck);
			return runGuardQueue(guards);
		}).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
	}
	function triggerAfterEach(to, from, failure) {
		afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
	}
	/**
	* - Cleans up any navigation guards
	* - Changes the url if necessary
	* - Calls the scrollBehavior
	*/
	function finalizeNavigation(toLocation, from, isPush, replace, data) {
		const error = checkCanceledNavigation(toLocation, from);
		if (error) return error;
		const isFirstNavigation = from === START_LOCATION_NORMALIZED;
		const state = {};
		if (isPush) {
			if (replace || isFirstNavigation) routerHistory.replace(toLocation.fullPath, assign({ scroll: isFirstNavigation && state && state.scroll }, data));
			else routerHistory.push(toLocation.fullPath, data);
		}
		currentRoute.value = toLocation;
		handleScroll();
		markAsReady();
	}
	let removeHistoryListener;
	function setupListeners() {
		if (removeHistoryListener) return;
		removeHistoryListener = routerHistory.listen((to, _from, info) => {
			if (!router.listening) return;
			const toLocation = resolve(to);
			const shouldRedirect = handleRedirectRecord(toLocation, router.currentRoute.value);
			if (shouldRedirect) {
				pushWithRedirect(assign(shouldRedirect, {
					replace: true,
					force: true
				}), toLocation).catch(noop$1);
				return;
			}
			pendingLocation = toLocation;
			const from = currentRoute.value;
			navigate(toLocation, from).catch((error) => {
				if (isNavigationFailure(error, 12)) return error;
				if (isNavigationFailure(error, 2)) {
					pushWithRedirect(assign(locationAsObject(error.to), { force: true }), toLocation).then((failure) => {
						if (isNavigationFailure(failure, 20) && !info.delta && info.type === "pop") routerHistory.go(-1, false);
					}).catch(noop$1);
					return Promise.reject();
				}
				if (info.delta) routerHistory.go(-info.delta, false);
				return triggerError(error, toLocation, from);
			}).then((failure) => {
				failure = failure || finalizeNavigation(toLocation, from, false);
				if (failure) {
					if (info.delta && !isNavigationFailure(failure, 8)) routerHistory.go(-info.delta, false);
					else if (info.type === "pop" && isNavigationFailure(failure, 20)) routerHistory.go(-1, false);
				}
				triggerAfterEach(toLocation, from, failure);
			}).catch(noop$1);
		});
	}
	let readyHandlers = useCallbacks();
	let errorListeners = useCallbacks();
	let ready;
	/**
	* Trigger errorListeners added via onError and throws the error as well
	*
	* @param error - error to throw
	* @param to - location we were navigating to when the error happened
	* @param from - location we were navigating from when the error happened
	* @returns the error as a rejected promise
	*/
	function triggerError(error, to, from) {
		markAsReady(error);
		const list = errorListeners.list();
		if (list.length) list.forEach((handler) => handler(error, to, from));
		else console.error(error);
		return Promise.reject(error);
	}
	function isReady() {
		if (ready && currentRoute.value !== START_LOCATION_NORMALIZED) return Promise.resolve();
		return new Promise((resolve, reject) => {
			readyHandlers.add([resolve, reject]);
		});
	}
	function markAsReady(err) {
		if (!ready) {
			ready = !err;
			setupListeners();
			readyHandlers.list().forEach(([resolve, reject]) => err ? reject(err) : resolve());
			readyHandlers.reset();
		}
		return err;
	}
	function handleScroll(to, from, isPush, isFirstNavigation) {
		const { scrollBehavior } = options;
		return Promise.resolve();
	}
	const go = (delta) => routerHistory.go(delta);
	const installedApps = /* @__PURE__ */ new Set();
	const router = {
		currentRoute,
		listening: true,
		addRoute,
		removeRoute,
		clearRoutes,
		hasRoute,
		getRoutes,
		resolve,
		options,
		push,
		replace,
		go,
		back: () => go(-1),
		forward: () => go(1),
		beforeEach: beforeGuards.add,
		beforeResolve: beforeResolveGuards.add,
		afterEach: afterGuards.add,
		onError: errorListeners.add,
		isReady,
		install(app) {
			app.component("RouterLink", RouterLink);
			app.component("RouterView", RouterView);
			app.config.globalProperties.$router = router;
			Object.defineProperty(app.config.globalProperties, "$route", {
				enumerable: true,
				get: () => unref(currentRoute)
			});
			const reactiveRoute = {};
			for (const key in START_LOCATION_NORMALIZED) Object.defineProperty(reactiveRoute, key, {
				get: () => currentRoute.value[key],
				enumerable: true
			});
			app.provide(routerKey, router);
			app.provide(routeLocationKey, shallowReactive(reactiveRoute));
			app.provide(routerViewLocationKey, currentRoute);
			const unmountApp = app.unmount;
			installedApps.add(app);
			app.unmount = function() {
				installedApps.delete(app);
				if (installedApps.size < 1) {
					pendingLocation = START_LOCATION_NORMALIZED;
					removeHistoryListener && removeHistoryListener();
					removeHistoryListener = null;
					currentRoute.value = START_LOCATION_NORMALIZED;
					ready = false;
				}
				unmountApp();
			};
		}
	};
	function runGuardQueue(guards) {
		return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
	}
	return router;
}
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/pages/runtime/validate.js
var middleware$1 = defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/manifest.js
function routeRulesMatcher$1(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default();
}
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher$1(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [middleware$1, /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
var namedMiddleware = {};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froutes.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default = [{
	name: "index",
	path: "/",
	component: () => import('../build/pages-O6OdkeHQ.mjs')
}];
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$1 = defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = useRuntimeConfig().app.baseURL;
		const history = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default : virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION_NORMALIZED) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION_NORMALIZED, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		router.onError(async () => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			await nuxtApp.callHook("page:loading:end");
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray$1(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const run = () => nuxtApp.runWithContext(() => middleware(to, from));
						const result = await run();
						if (result === false || result instanceof Error) {
							const error = result || createError({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createError(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		});
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.afterEach((to) => {
			if (to.matched.length === 0 && !error.value) return nuxtApp.runWithContext(() => showError(createError({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/diagnostics/state.js
/**
* E7xxx
* Payload / state / cookie runtime diagnostics.
*/
var stateDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return state;
		}
		state.value = initialValue;
	}
	return state;
}
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/ssr.js
var $fetch$1 = $fetch;
/** @since 3.0.0 */
function useRequestEvent(nuxtApp) {
	nuxtApp ||= useNuxtApp();
	return nuxtApp.ssrContext?.event;
}
/** @since 3.2.0 */
function useRequestFetch() {
	return useRequestEvent()?.$fetch || $fetch$1;
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcolor-mode-options.mjs
var preference = "system";
//#endregion
//#region node_modules/.pnpm/@nuxtjs+color-mode@4.0.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7._liiwkpxdtedt3o2e5fstf56kty/node_modules/@nuxtjs/color-mode/dist/runtime/plugin.server.js
var plugin_server_default = defineNuxtPlugin((nuxtApp) => {
	const colorMode = nuxtApp.ssrContext?.islandContext ? ref({}).value : useState("color-mode", () => reactive({
		preference,
		value: preference,
		unknown: true,
		forced: false
	})).value;
	const htmlAttrs = {};
	useHead({ htmlAttrs });
	useRouter().afterEach((to) => {
		const forcedColorMode = to.meta.colorMode;
		if (forcedColorMode && forcedColorMode !== "system") {
			htmlAttrs["data-color-mode-forced"] = forcedColorMode;
			colorMode.value = forcedColorMode;
			colorMode.forced = true;
		} else if (forcedColorMode === "system") console.warn("You cannot force the colorMode to system at the page level.");
	});
	nuxtApp.provide("colorMode", colorMode);
});
//#endregion
//#region node_modules/.pnpm/@nuxt+icon@2.5.1_@nuxt+schema@4.6.1_confbox@0.3.1_dotenv@17.4.2_giget@3.3.1_jiti@2.7.0_magic-_bfgxbtfwxtmtgwuw4go3jwql4u/node_modules/@nuxt/icon/dist/runtime/plugin.js
var plugin_default = defineNuxtPlugin({
	name: "@nuxt/icon",
	setup() {
		const configs = useRuntimeConfig();
		const options = useAppConfig().icon;
		const requestFetch = useRequestFetch();
		const nativeFetch = requestFetch.native;
		_api.setFetch((input, init) => {
			const nitroFetch = globalThis.$fetch?.native;
			return (nativeFetch || nitroFetch || globalThis.fetch)(input, init);
		});
		const resources = [];
		if (options.provider === "server") {
			const baseURL = configs.app?.baseURL?.replace(/\/$/, "") ?? "";
			resources.push(baseURL + (options.localApiEndpoint || "/api/_nuxt_icon"));
			if (options.fallbackToApi === true || options.fallbackToApi === "client-only") resources.push(options.iconifyApiEndpoint);
		} else if (options.provider === "none") _api.setFetch(() => Promise.resolve(new Response()));
		else resources.push(options.iconifyApiEndpoint);
		async function customIconLoader(icons, prefix) {
			try {
				const data = await requestFetch(resources[0] + "/" + prefix + ".json", { query: { icons: icons.join(",") } });
				if (!data || data.prefix !== prefix || !data.icons) throw new Error("Invalid data" + JSON.stringify(data));
				return data;
			} catch (e) {
				console.error("Failed to load custom icons", e);
				return null;
			}
		}
		addAPIProvider("", { resources });
		for (const prefix of options.customCollections || []) if (prefix) setCustomIconsLoader(customIconLoader, prefix);
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcomponents.plugin.mjs
var lazyGlobalComponents = [["Icon", defineAsyncComponent(() => Promise.resolve().then(function () { return componentsBP2DGhnz; }).then((n) => n.n).then((r) => r["default"] || r.default || r))]];
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default = defineNuxtPlugin({
	name: "nuxt:global-components",
	setup(nuxtApp) {
		for (const [name, component] of lazyGlobalComponents) {
			nuxtApp.vueApp.component(name, component);
			nuxtApp.vueApp.component("Lazy" + name, component);
		}
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/plugins/colors.js
var shades = [
	50,
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900,
	950
];
function getColor(color, shade) {
	if (color in colors && typeof colors[color] === "object" && shade in colors[color]) return colors[color][shade];
	return "";
}
function generateShades(key, value, prefix) {
	const prefixStr = prefix ? `${prefix}-` : "";
	return `${shades.map((shade) => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`).join("\n  ")}`;
}
function generateColor(key, shade) {
	return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	plugin$2,
	plugin$1,
	plugin,
	plugin_server_default,
	plugin_default,
	virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default,
	defineNuxtPlugin(() => {
		const appConfig = useAppConfig();
		useNuxtApp();
		const root = computed(() => {
			const { neutral, ...colors2 } = appConfig.ui.colors;
			const prefix = appConfig.ui.prefix;
			return `@layer theme {
  :root, :host {
  ${Object.entries(appConfig.ui.colors).map(([key, value]) => generateShades(key, value, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors2).map((key) => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors2).map((key) => generateColor(key, 400)).join("\n  ")}
  }
}`;
		});
		useHead({ style: [{
			innerHTML: root,
			tagPriority: "critical",
			id: "nuxt-ui-colors"
		}] });
	})
];
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/createContext.js
/**
* @param providerComponentName - The name(s) of the component(s) providing the context.
*
* There are situations where context can come from multiple components. In such cases, you might need to give an array of component names to provide your context, instead of just a single string.
*
* @param contextName The description for injection key symbol.
*/
function createContext(providerComponentName, contextName) {
	const symbolDescription = typeof providerComponentName === "string" && !contextName ? `${providerComponentName}Context` : contextName;
	const injectionKey = Symbol(symbolDescription);
	/**
	* @param fallback The context value to return if the injection fails.
	*
	* @throws When context injection failed and no fallback is specified.
	* This happens when the component injecting the context is not a child of the root component providing the context.
	*/
	const injectContext = (fallback) => {
		const context = inject(injectionKey, fallback);
		if (context) return context;
		if (context === null) return context;
		throw new Error(`Injection \`${injectionKey.toString()}\` not found. Component must be used within ${Array.isArray(providerComponentName) ? `one of the following components: ${providerComponentName.join(", ")}` : `\`${providerComponentName}\``}`);
	};
	const provideContext = (contextValue) => {
		provide(injectionKey, contextValue);
		return contextValue;
	};
	return [injectContext, provideContext];
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/getActiveElement.js
function getActiveElement() {
	let activeElement = (void 0).activeElement;
	if (activeElement == null) return null;
	while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
	return activeElement;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/nullish.js
function isNullish(value) {
	return value === null || value === void 0;
}
//#endregion
//#region node_modules/.pnpm/@vueuse+shared@14.4.0_vue@3.5.44_typescript@5.9.3_/node_modules/@vueuse/shared/dist/index.js
/**
* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
*
* @param fn
*/
function tryOnScopeDispose(fn, failSilently) {
	if (getCurrentScope()) {
		onScopeDispose(fn, failSilently);
		return true;
	}
	return false;
}
/**
* Keep states in the global scope to be reusable across Vue instances.
*
* @see https://vueuse.org/createGlobalState
* @param stateFactory A factory function to create the state
*
* @__NO_SIDE_EFFECTS__
*/
function createGlobalState(stateFactory) {
	let initialized = false;
	let state;
	const scope = effectScope(true);
	return ((...args) => {
		if (!initialized) {
			state = scope.run(() => stateFactory(...args));
			initialized = true;
		}
		return state;
	});
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var isDef = (val) => typeof val !== "undefined";
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
var noop = () => {};
function toRef$2(...args) {
	if (args.length !== 1) return toRef(...args);
	const r = args[0];
	return typeof r === "function" ? readonly(customRef(() => ({
		get: r,
		set: noop
	}))) : ref(r);
}
function createFilterWrapper(filter, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	if ("cancel" in filter) Object.assign(wrapper, {
		cancel: filter.cancel,
		flush: filter.flush,
		isPending: filter.isPending
	});
	return wrapper;
}
/**
* Create an EventFilter that debounce the events
*/
function debounceFilter(ms, options = {}) {
	let timer;
	let maxTimer;
	let lastRejector = noop;
	let lastResolve = noop;
	const _pending = shallowRef(false);
	const _clearTimeout = (timer) => {
		clearTimeout(timer);
		lastRejector();
		lastRejector = noop;
	};
	let lastInvoker;
	const handler = (invoke) => {
		const duration = toValue(ms);
		const maxDuration = toValue(options.maxWait);
		if (timer) _clearTimeout(timer);
		if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			_pending.value = false;
			return Promise.resolve(invoke());
		}
		_pending.value = true;
		return new Promise((resolve, reject) => {
			lastRejector = options.rejectOnCancel ? reject : resolve;
			lastResolve = resolve;
			lastInvoker = invoke;
			if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
				if (timer) _clearTimeout(timer);
				maxTimer = void 0;
				_pending.value = false;
				resolve(lastInvoker());
			}, maxDuration);
			timer = setTimeout(() => {
				if (maxTimer) _clearTimeout(maxTimer);
				maxTimer = void 0;
				_pending.value = false;
				resolve(invoke());
			}, duration);
		});
	};
	return Object.assign(handler, {
		cancel: () => {
			if (timer) {
				_clearTimeout(timer);
				timer = void 0;
			}
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			_pending.value = false;
			lastResolve = noop;
		},
		flush: () => {
			if (_pending.value) {
				if (timer) {
					clearTimeout(timer);
					timer = void 0;
				}
				if (maxTimer) {
					clearTimeout(maxTimer);
					maxTimer = void 0;
				}
				_pending.value = false;
				const resolve = lastResolve;
				lastRejector = noop;
				lastResolve = noop;
				resolve(lastInvoker());
			}
		},
		isPending: shallowReadonly(_pending)
	});
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
function cacheStringFunction(fn) {
	const cache = Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
}
var camelizeRE = /-(\w)/g;
var camelize$1 = cacheStringFunction((str) => {
	return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
function getLifeCycleTarget(target) {
	return getCurrentInstance();
}
/**
* Make a composable function usable with multiple Vue instances.
*
* @see https://vueuse.org/createSharedComposable
*
* @__NO_SIDE_EFFECTS__
*/
function createSharedComposable(composable) {
	return composable;
}
/* @__NO_SIDE_EFFECTS__ */
function makeDestructurable(obj, arr) {
	if (typeof Symbol !== "undefined") {
		const clone = { ...obj };
		Object.defineProperty(clone, Symbol.iterator, {
			enumerable: false,
			value() {
				let index = 0;
				return { next: () => ({
					value: arr[index++],
					done: index > arr.length
				}) };
			}
		});
		return clone;
	} else return Object.assign([...arr], obj);
}
/**
* Converts ref to reactive.
*
* @see https://vueuse.org/toReactive
* @param objectRef A ref of object
*/
function toReactive(objectRef) {
	if (!isRef(objectRef)) return reactive(objectRef);
	return reactive(new Proxy({}, {
		get(_, p, receiver) {
			return unref(Reflect.get(objectRef.value, p, receiver));
		},
		set(_, p, value) {
			if (isRef(objectRef.value[p]) && !isRef(value)) objectRef.value[p].value = value;
			else objectRef.value[p] = value;
			return true;
		},
		deleteProperty(_, p) {
			return Reflect.deleteProperty(objectRef.value, p);
		},
		has(_, p) {
			return Reflect.has(objectRef.value, p);
		},
		ownKeys() {
			return Object.keys(objectRef.value);
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	}));
}
/**
* Computed reactive object.
*/
function reactiveComputed(fn) {
	return toReactive(computed(fn));
}
/**
* Reactively omit fields from a reactive object
*
* @see https://vueuse.org/reactiveOmit
*/
function reactiveOmit(obj, ...keys) {
	const flatKeys = keys.flat();
	const predicate = flatKeys[0];
	return reactiveComputed(() => typeof predicate === "function" ? Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => !predicate(toValue(v), k))) : Object.fromEntries(Object.entries(toRefs(obj)).filter((e) => !flatKeys.includes(e[0]))));
}
/**
* Reactively pick fields from a reactive object
*
* @see https://vueuse.org/reactivePick
*/
function reactivePick(obj, ...keys) {
	const flatKeys = keys.flat();
	const predicate = flatKeys[0];
	return reactiveComputed(() => typeof predicate === "function" ? Object.fromEntries(Object.entries(toRefs(obj)).filter(([k, v]) => predicate(toValue(v), k))) : Object.fromEntries(flatKeys.map((k) => [k, toRef$2(obj, k)])));
}
/**
* Debounce execution of a function.
*
* @see https://vueuse.org/useDebounceFn
* @param  fn          A function to be executed after delay milliseconds debounced.
* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
* @param  options     Options
*
* @return A new, debounced, function with isPending, cancel, and flush properties.
*/
function useDebounceFn(fn, ms = 200, options = {}) {
	return createFilterWrapper(debounceFilter(ms, options), fn);
}
/**
* Call onBeforeUnmount() if it's inside a component lifecycle, if not, do nothing
*
* @param fn
* @param target
*/
function tryOnBeforeUnmount(fn, target) {
	if (getLifeCycleTarget());
}
/**
* Wrapper for `setTimeout` with controls.
*
* @param cb
* @param interval
* @param options
*/
function useTimeoutFn(cb, interval, options = {}) {
	const { immediate = true, immediateCallback = false } = options;
	const isPending = shallowRef(false);
	let timer;
	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	}
	function stop() {
		isPending.value = false;
		clear();
	}
	function start(...args) {
		if (immediateCallback) cb();
		clear();
		isPending.value = true;
		timer = setTimeout(() => {
			isPending.value = false;
			timer = void 0;
			cb(...args);
		}, toValue(interval));
	}
	if (immediate) isPending.value = true;
	tryOnScopeDispose(stop);
	return {
		isPending: shallowReadonly(isPending),
		start,
		stop
	};
}
function useTimeout(interval = 1e3, options = {}) {
	const { controls: exposeControls = false, callback } = options;
	const controls = useTimeoutFn(callback !== null && callback !== void 0 ? callback : noop, interval, options);
	const ready = computed(() => !controls.isPending.value);
	if (exposeControls) return {
		ready,
		...controls
	};
	else return ready;
}
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
//#endregion
//#region node_modules/.pnpm/@vueuse+core@14.4.0_vue@3.5.44_typescript@5.9.3_/node_modules/@vueuse/core/dist/index.js
/**
* This function creates `define` and `reuse` components in pair,
* It also allow to pass a generic to bind with type.
*
* @see https://vueuse.org/createReusableTemplate
*
* @__NO_SIDE_EFFECTS__
*/
function createReusableTemplate(options = {}) {
	const { inheritAttrs = true, name = "ReusableTemplate" } = options;
	const render = shallowRef();
	const define = defineComponent({
		name: `${name}.define`,
		setup(_, { slots }) {
			return () => {
				render.value = slots.default;
			};
		}
	});
	const reuse = defineComponent({
		inheritAttrs,
		name: `${name}.reuse`,
		props: options.props,
		setup(props, { attrs, slots }) {
			return () => {
				var _render$value;
				if (!render.value && true) throw new Error("[VueUse] Failed to find the definition of reusable template");
				const vnode = (_render$value = render.value) === null || _render$value === void 0 ? void 0 : _render$value.call(render, {
					...options.props == null ? keysToCamelKebabCase(attrs) : props,
					$slots: slots
				});
				return inheritAttrs && (vnode === null || vnode === void 0 ? void 0 : vnode.length) === 1 ? vnode[0] : vnode;
			};
		}
	});
	return /* @__PURE__ */ makeDestructurable({
		define,
		reuse
	}, [define, reuse]);
}
function keysToCamelKebabCase(obj) {
	const newObj = {};
	for (const key in obj) newObj[camelize$1(key)] = obj[key];
	return newObj;
}
var defaultWindow = void 0;
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
/**
* Mounted state in ref.
*
* @see https://vueuse.org/useMounted
*
* @__NO_SIDE_EFFECTS__
*/
function useMounted() {
	const isMounted = shallowRef(false);
	if (getCurrentInstance());
	return isMounted;
}
function createKeyPredicate(keyFilter) {
	if (typeof keyFilter === "function") return keyFilter;
	else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
	else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
	return () => true;
}
function onKeyStroke(...args) {
	let key;
	let handler;
	let options = {};
	if (args.length === 3) {
		key = args[0];
		handler = args[1];
		options = args[2];
	} else if (args.length === 2) if (typeof args[1] === "object") {
		key = true;
		handler = args[0];
		options = args[1];
	} else {
		key = args[0];
		handler = args[1];
	}
	else {
		key = true;
		handler = args[0];
	}
	const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
	const predicate = createKeyPredicate(key);
	const listener = (e) => {
		if (e.repeat && toValue(dedupe)) return;
		if (predicate(e)) handler(e);
	};
	return useEventListener(target, eventName, listener, passive);
}
/**
* Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
*
* @see https://vueuse.org/useRafFn
* @param fn
* @param options
*/
function useRafFn(fn, options = {}) {
	const { immediate = true, fpsLimit = null, window = defaultWindow, once = false } = options;
	const isActive = shallowRef(false);
	const intervalLimit = computed(() => {
		const limit = toValue(fpsLimit);
		return limit ? 1e3 / limit : null;
	});
	let previousFrameTimestamp = 0;
	let rafId = null;
	function loop(timestamp) {
		if (!isActive.value || !window) return;
		if (!previousFrameTimestamp) previousFrameTimestamp = timestamp;
		const delta = timestamp - previousFrameTimestamp;
		if (intervalLimit.value && delta < intervalLimit.value) {
			rafId = window.requestAnimationFrame(loop);
			return;
		}
		previousFrameTimestamp = timestamp;
		fn({
			delta,
			timestamp
		});
		if (once) {
			isActive.value = false;
			rafId = null;
			return;
		}
		rafId = window.requestAnimationFrame(loop);
	}
	function resume() {
		if (!isActive.value && window) {
			isActive.value = true;
			previousFrameTimestamp = 0;
			rafId = window.requestAnimationFrame(loop);
		}
	}
	function pause() {
		isActive.value = false;
		if (rafId != null && window) {
			window.cancelAnimationFrame(rafId);
			rafId = null;
		}
	}
	if (immediate) resume();
	tryOnScopeDispose(pause);
	return {
		isActive: shallowReadonly(isActive),
		pause,
		resume
	};
}
function cloneFnJSON(source) {
	return JSON.parse(JSON.stringify(source));
}
/**
* Shorthand for v-model binding, props + emit -> ref
*
* @see https://vueuse.org/useVModel
* @param props
* @param key (default 'modelValue')
* @param emit
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useVModel(props, key, emit, options = {}) {
	var _vm$$emit, _vm$proxy;
	const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
	const vm = getCurrentInstance();
	const _emit = emit || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
	let event = eventName;
	if (!key) key = "modelValue";
	event = event || `update:${key.toString()}`;
	const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
	const getValue = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
	const triggerEmit = (value) => {
		if (shouldEmit) {
			if (shouldEmit(value)) _emit(event, value);
		} else _emit(event, value);
	};
	if (passive) {
		const proxy = ref(getValue());
		let isUpdating = false;
		watch(() => props[key], (v) => {
			if (!isUpdating) {
				isUpdating = true;
				proxy.value = cloneFn(v);
				nextTick(() => isUpdating = false);
			}
		});
		watch(proxy, (v) => {
			if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
		}, { deep });
		return proxy;
	} else return computed({
		get() {
			return getValue();
		},
		set(value) {
			triggerEmit(value);
		}
	});
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/renderSlotFragments.js
function renderSlotFragments(children) {
	if (!children) return [];
	return children.flatMap((child) => {
		if (child.type === Fragment) return renderSlotFragments(child.children);
		return [child];
	});
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js
var [injectConfigProviderContext, provideConfigProviderContext] = /*#__PURE__*/ createContext("ConfigProvider");
var ConfigProvider_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ConfigProvider",
	props: {
		dir: {
			type: String,
			required: false,
			default: "ltr"
		},
		locale: {
			type: String,
			required: false,
			default: "en"
		},
		scrollBody: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		nonce: {
			type: String,
			required: false,
			default: void 0
		},
		teleportTo: {
			type: null,
			required: false,
			default: void 0
		},
		useId: {
			type: Function,
			required: false,
			default: void 0
		}
	},
	setup(__props) {
		const props = __props;
		const { dir, locale, scrollBody, nonce, teleportTo } = toRefs(props);
		provideConfigProviderContext({
			dir,
			locale,
			scrollBody,
			nonce,
			teleportTo,
			useId: props.useId
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useEmitAsProps.js
/**
* The `useEmitAsProps` function is a TypeScript utility that converts emitted events into props for a
* Vue component.
*
* @template Name - The event name string union type.
* @template Fn - The emit function type.
*
* @param emit - The `emit` parameter is a function that is used to emit events from a component. It
*
* takes two parameters: `name` which is the name of the event to be emitted, and `...args` which are
* the arguments to be passed along with the event.
* @returns The function `useEmitAsProps` returns an object that maps event names to functions that
* call the `emit` function with the corresponding event name and arguments.
*/
function useEmitAsProps(emit) {
	const vm = getCurrentInstance();
	const events = vm?.type.emits;
	const result = {};
	if (!events?.length) console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`);
	events?.forEach((ev) => {
		result[toHandlerKey(camelize(ev))] = (...arg) => emit(ev, ...arg);
	});
	return result;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardExpose.js
function useForwardExpose() {
	const instance = getCurrentInstance();
	const currentRef = ref();
	const currentElement = computed(() => resolveCurrentElement());
	function resolveCurrentElement() {
		return currentRef.value && "$el" in currentRef.value && ["#text", "#comment"].includes(currentRef.value.$el.nodeName) ? currentRef.value.$el.nextElementSibling : unrefElement(currentRef);
	}
	const localExpose = Object.assign({}, instance.exposed);
	const ret = {};
	for (const key in instance.props) Object.defineProperty(ret, key, {
		enumerable: true,
		configurable: true,
		get: () => instance.props[key]
	});
	if (Object.keys(localExpose).length > 0) for (const key in localExpose) Object.defineProperty(ret, key, {
		enumerable: true,
		configurable: true,
		get: () => localExpose[key]
	});
	Object.defineProperty(ret, "$el", {
		enumerable: true,
		configurable: true,
		get: () => instance.vnode.el
	});
	instance.exposed = ret;
	function forwardRef(ref$1) {
		currentRef.value = ref$1;
		if (!ref$1) return;
		Object.defineProperty(ret, "$el", {
			enumerable: true,
			configurable: true,
			get: () => ref$1 instanceof Element ? ref$1 : ref$1.$el
		});
		if (!(ref$1 instanceof Element) && !Object.hasOwn(ref$1, "$el")) {
			const childExposed = ref$1.$.exposed;
			const merged = Object.assign({}, ret);
			for (const key in childExposed) Object.defineProperty(merged, key, {
				enumerable: true,
				configurable: true,
				get: () => childExposed[key]
			});
			instance.exposed = merged;
		}
	}
	return {
		forwardRef,
		currentRef,
		currentElement
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useForwardProps.js
/**
* The `useForwardProps` function in TypeScript takes in a set of props and returns a computed value
* that combines default props with assigned props from the current instance.
* @param {T} props - The `props` parameter is an object that represents the props passed to a
* component.
* @returns computed value that combines the default props, preserved props, and assigned props.
*/
function useForwardProps$1(props) {
	const vm = getCurrentInstance();
	const defaultProps = Object.keys(vm?.type.props ?? {}).reduce((prev, curr) => {
		const defaultValue = (vm?.type.props[curr]).default;
		if (defaultValue !== void 0) prev[curr] = defaultValue;
		return prev;
	}, {});
	const refProps = toRef(props);
	return computed(() => {
		const preservedProps = {};
		const assignedProps = vm?.vnode.props ?? {};
		Object.keys(assignedProps).forEach((key) => {
			preservedProps[camelize(key)] = assignedProps[key];
		});
		return Object.keys({
			...defaultProps,
			...preservedProps
		}).reduce((prev, curr) => {
			if (refProps.value[curr] !== void 0) prev[curr] = refProps.value[curr];
			return prev;
		}, {});
	});
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/shared/useStateMachine.js
/**
* The `useStateMachine` function is a TypeScript function that creates a state machine and returns the
* current state and a dispatch function to update the state based on events.
* @param initialState - The `initialState` parameter is the initial state of the state machine. It
* represents the starting point of the state machine's state.
* @param machine - The `machine` parameter is an object that represents a state machine. It should
* have keys that correspond to the possible states of the machine, and the values should be objects
* that represent the possible events and their corresponding next states.
* @returns The `useStateMachine` function returns an object with two properties: `state` and
* `dispatch`.
*/
function useStateMachine(initialState, machine) {
	const state = ref(initialState);
	function reducer(event) {
		return machine[state.value][event] ?? state.value;
	}
	const dispatch = (event) => {
		state.value = reducer(event);
	};
	return {
		state,
		dispatch
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Presence/usePresence.js
function usePresence(present, node) {
	const stylesRef = ref({});
	const prevAnimationNameRef = ref("none");
	const prevPresentRef = ref(present);
	const initialState = present.value ? "mounted" : "unmounted";
	let timeoutId;
	const ownerWindow = node.value?.ownerDocument.defaultView ?? defaultWindow;
	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	watch(present, async (currentPresent, prevPresent) => {
		const hasPresentChanged = prevPresent !== currentPresent;
		await nextTick();
		if (hasPresentChanged) {
			const prevAnimationName = prevAnimationNameRef.value;
			const currentAnimationName = getAnimationName(node.value);
			if (currentPresent) {
				dispatch("MOUNT");
			} else if (currentAnimationName === "none" || currentAnimationName === "undefined" || stylesRef.value?.display === "none") dispatch("UNMOUNT");
			else if (prevPresent && prevAnimationName !== currentAnimationName) dispatch("ANIMATION_OUT");
			else dispatch("UNMOUNT");
		}
	}, { immediate: true });
	/**
	* Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	* event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	* make sure we only trigger ANIMATION_END for the currently active animation.
	*/
	const handleAnimationEnd = (event) => {
		if (event.target !== node.value) return;
		const currentAnimationName = getAnimationName(node.value);
		const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
		state.value === "mounted" ? "enter" : "leave";
		if (isCurrentAnimation) {
			dispatch("ANIMATION_END");
			if (!prevPresentRef.value) {
				const currentFillMode = node.value.style.animationFillMode;
				node.value.style.animationFillMode = "forwards";
				timeoutId = ownerWindow?.setTimeout(() => {
					if (node.value?.style.animationFillMode === "forwards") node.value.style.animationFillMode = currentFillMode;
				});
			}
		}
		if (currentAnimationName === "none") dispatch("ANIMATION_END");
	};
	const handleAnimationStart = (event) => {
		if (event.target === node.value) prevAnimationNameRef.value = getAnimationName(node.value);
	};
	watch(node, (newNode, oldNode) => {
		if (newNode) {
			stylesRef.value = getComputedStyle(newNode);
			newNode.addEventListener("animationstart", handleAnimationStart);
			newNode.addEventListener("animationcancel", handleAnimationEnd);
			newNode.addEventListener("animationend", handleAnimationEnd);
		} else {
			dispatch("ANIMATION_END");
			if (timeoutId !== void 0) ownerWindow?.clearTimeout(timeoutId);
			oldNode?.removeEventListener("animationstart", handleAnimationStart);
			oldNode?.removeEventListener("animationcancel", handleAnimationEnd);
			oldNode?.removeEventListener("animationend", handleAnimationEnd);
		}
	}, { immediate: true });
	watch(state, () => {
		const currentAnimationName = getAnimationName(node.value);
		prevAnimationNameRef.value = state.value === "mounted" ? currentAnimationName : "none";
	});
	return { isPresent: computed(() => ["mounted", "unmountSuspended"].includes(state.value)) };
}
function getAnimationName(node) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Presence/Presence.js
var Presence_default = /*#__PURE__*/ defineComponent({
	name: "Presence",
	props: {
		present: {
			type: Boolean,
			required: true
		},
		forceMount: { type: Boolean }
	},
	slots: {},
	setup(props, { slots, expose }) {
		const { present, forceMount } = toRefs(props);
		const node = ref();
		const { isPresent } = usePresence(present, node);
		expose({ present: isPresent });
		let children = slots.default({ present: isPresent.value });
		children = renderSlotFragments(children || []);
		const instance = getCurrentInstance();
		if (children && children?.length > 1) {
			const componentName = instance?.parent?.type.name ? `<${instance.parent.type.name} />` : "component";
			throw new Error([
				`Detected an invalid children for \`${componentName}\` for  \`Presence\` component.`,
				"",
				"Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
				"You can apply a few solutions:",
				["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((line) => `  - ${line}`).join("\n")
			].join("\n"));
		}
		return () => {
			if (forceMount.value || present.value || isPresent.value) return h(slots.default({ present: isPresent.value })[0], { ref: (v) => {
				const el = unrefElement(v);
				if (typeof el?.hasAttribute === "undefined") return el;
				if (el?.hasAttribute("data-reka-popper-content-wrapper")) node.value = el.firstElementChild;
				else node.value = el;
				return el;
			} });
			else return null;
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/Slot.js
var Slot = /*#__PURE__*/ defineComponent({
	name: "PrimitiveSlot",
	inheritAttrs: false,
	setup(_, { attrs, slots }) {
		return () => {
			if (!slots.default) return null;
			const children = renderSlotFragments(slots.default());
			const firstNonCommentChildrenIndex = children.findIndex((child) => child.type !== Comment);
			if (firstNonCommentChildrenIndex === -1) return children;
			const firstNonCommentChildren = children[firstNonCommentChildrenIndex];
			delete firstNonCommentChildren.props?.ref;
			const mergedProps = firstNonCommentChildren.props ? mergeProps(attrs, firstNonCommentChildren.props) : attrs;
			const cloned = cloneVNode({
				...firstNonCommentChildren,
				props: {}
			}, mergedProps);
			if (children.length === 1) return cloned;
			children[firstNonCommentChildrenIndex] = cloned;
			return children;
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/Primitive.js
var SELF_CLOSING_TAGS = [
	"area",
	"img",
	"input"
];
var Primitive = /*#__PURE__*/ defineComponent({
	name: "Primitive",
	inheritAttrs: false,
	props: {
		asChild: {
			type: Boolean,
			default: false
		},
		as: {
			type: [String, Object],
			default: "div"
		}
	},
	setup(props, { attrs, slots }) {
		const asTag = props.asChild ? "template" : props.as;
		if (typeof asTag === "string" && SELF_CLOSING_TAGS.includes(asTag)) return () => h(asTag, attrs);
		if (asTag !== "template") return () => h(props.as, attrs, { default: slots.default });
		return () => h(Slot, attrs, { default: slots.default });
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
function usePrimitiveElement() {
	const primitiveElement = ref();
	return {
		primitiveElement,
		currentElement: computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement))
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/DismissableLayer/DismissableLayerBranch.js
var DismissableLayerBranch_default = /* @__PURE__ */ defineComponent({
	__name: "DismissableLayerBranch",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const { forwardRef} = useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps({ ref: unref(forwardRef) }, props), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/FocusScope/utils.js
var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
var EVENT_OPTIONS = {
	bubbles: false,
	cancelable: true
};
/**
* Attempts focusing the first element in a list of candidates.
* Stops when focus has actually moved.
*/
function focusFirst(candidates, { select = false } = {}) {
	const previouslyFocusedElement = getActiveElement();
	for (const candidate of candidates) {
		focus(candidate, { select });
		if (getActiveElement() !== previouslyFocusedElement) return true;
	}
}
/**
* Returns the first and last tabbable elements inside a container.
*/
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
}
/**
* Returns a list of potential tabbable candidates.
*
* NOTE: This is only a close approximation. For example it doesn't take into account cases like when
* elements are not visible. This cannot be worked out easily by just reading a property, but rather
* necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
*
* See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
* Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
*/
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = (void 0).createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
/**
* Returns the first visible element in a list.
* NOTE: Only checks visibility up to the `container`.
*/
function findVisible(elements, container) {
	for (const element of elements) if (!isHidden(element, { upTo: container })) return element;
}
function isHidden(node, { upTo }) {
	if (getComputedStyle(node).visibility === "hidden") return true;
	while (node) {
		if (upTo !== void 0 && node === upTo) return false;
		if (getComputedStyle(node).display === "none") return true;
		node = node.parentElement;
	}
	return false;
}
function isSelectableInput(element) {
	return element instanceof HTMLInputElement && "select" in element;
}
function focus(element, { select = false } = {}) {
	if (element && element.focus) {
		const previouslyFocusedElement = getActiveElement();
		element.focus({ preventScroll: true });
		if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
	}
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Teleport/Teleport.js
var Teleport_default = /* @__PURE__ */ defineComponent({
	__name: "Teleport",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const configContext = injectConfigProviderContext({});
		const target = computed(() => props.to ?? configContext.teleportTo?.value ?? "body");
		const isMounted = useMounted();
		return (_ctx, _cache) => {
			return unref(isMounted) || _ctx.forceMount ? (openBlock(), createBlock(Teleport, {
				key: 0,
				to: target.value,
				disabled: _ctx.disabled,
				defer: _ctx.defer
			}, [renderSlot(_ctx.$slots, "default")], 8, [
				"to",
				"disabled",
				"defer"
			])) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Collection/Collection.js
var ITEM_DATA_ATTR = "data-reka-collection-item";
function useCollection(options = {}) {
	const { key = "", isProvider = false } = options;
	const injectionKey = `${key}CollectionProvider`;
	let context;
	if (isProvider) {
		const itemMap = ref(/* @__PURE__ */ new Map());
		context = {
			collectionRef: ref(),
			itemMap
		};
		provide(injectionKey, context);
	} else context = inject(injectionKey);
	const getItem = (element, includeDisabledItem = false) => {
		if (!context.collectionRef.value) return void 0;
		const item = context.itemMap.value.get(element);
		return item && (includeDisabledItem || item.ref.dataset.disabled !== "") ? item : void 0;
	};
	const getItems = (includeDisabledItem = false) => {
		const collectionNode = context.collectionRef.value;
		if (!collectionNode) return [];
		const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
		const orderMap = new Map(orderedNodes.map((node, index) => [node, index]));
		const orderedItems = Array.from(context.itemMap.value.values()).sort((a, b) => (orderMap.get(a.ref) ?? -1) - (orderMap.get(b.ref) ?? -1));
		if (includeDisabledItem) return orderedItems;
		else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
	};
	const CollectionSlot = /*#__PURE__*/ defineComponent({
		name: "CollectionSlot",
		inheritAttrs: false,
		setup(_, { slots, attrs }) {
			const { primitiveElement, currentElement } = usePrimitiveElement();
			watch(currentElement, () => {
				context.collectionRef.value = currentElement.value;
			});
			return () => h(Slot, {
				ref: primitiveElement,
				...attrs
			}, slots);
		}
	});
	const CollectionItem = /*#__PURE__*/ defineComponent({
		name: "CollectionItem",
		inheritAttrs: false,
		props: { value: { validator: () => true } },
		setup(props, { slots, attrs }) {
			const { primitiveElement, currentElement } = usePrimitiveElement();
			watchEffect((cleanupFn) => {
				if (currentElement.value) {
					const key$1 = markRaw(currentElement.value);
					context.itemMap.value.set(key$1, {
						ref: currentElement.value,
						value: props.value
					});
					cleanupFn(() => context.itemMap.value.delete(key$1));
				}
			});
			return () => h(Slot, {
				...attrs,
				[ITEM_DATA_ATTR]: "",
				ref: primitiveElement
			}, slots);
		}
	});
	return {
		getItems,
		getItem,
		reactiveItems: computed(() => Array.from(context.itemMap.value.values())),
		itemMapSize: computed(() => context.itemMap.value.size),
		CollectionSlot,
		CollectionItem
	};
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
var VisuallyHidden_default = /* @__PURE__ */ defineComponent({
	__name: "VisuallyHidden",
	props: {
		feature: {
			type: String,
			required: false,
			default: "focusable"
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "span"
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"aria-hidden": _ctx.feature === "focusable" || _ctx.feature === "fully-hidden" ? "true" : void 0,
				"data-hidden": _ctx.feature === "fully-hidden" ? "" : void 0,
				tabindex: _ctx.feature === "fully-hidden" ? "-1" : void 0,
				style: {
					position: "absolute",
					border: 0,
					width: "1px",
					height: "1px",
					padding: 0,
					margin: "-1px",
					overflow: "hidden",
					clip: "rect(0, 0, 0, 0)",
					clipPath: "inset(50%)",
					whiteSpace: "nowrap",
					wordWrap: "normal",
					top: "-1px",
					left: "-1px"
				}
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"aria-hidden",
				"data-hidden",
				"tabindex"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Progress/ProgressRoot.js
var DEFAULT_MAX = 100;
var [injectProgressRootContext, provideProgressRootContext] = /*#__PURE__*/ createContext("ProgressRoot");
var isNumber$1 = (v) => typeof v === "number";
function validateValue(value, max) {
	if (isNullish(value) || isNumber$1(value) && !Number.isNaN(value) && value <= max && value >= 0) return value;
	console.error(`Invalid prop \`value\` of value \`${value}\` supplied to \`ProgressRoot\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\`  or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`);
	return null;
}
function validateMax(max) {
	if (isNumber$1(max) && !Number.isNaN(max) && max > 0) return max;
	console.error(`Invalid prop \`max\` of value \`${max}\` supplied to \`ProgressRoot\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`);
	return DEFAULT_MAX;
}
var ProgressRoot_default = /* @__PURE__ */ defineComponent({
	__name: "ProgressRoot",
	props: {
		modelValue: {
			type: [Number, null],
			required: false
		},
		max: {
			type: Number,
			required: false,
			default: DEFAULT_MAX
		},
		getValueLabel: {
			type: Function,
			required: false,
			default: (value, max) => isNumber$1(value) ? `${Math.round(value / max * DEFAULT_MAX)}%` : void 0
		},
		getValueText: {
			type: Function,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	emits: ["update:modelValue", "update:max"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		useForwardExpose();
		const modelValue = useVModel(props, "modelValue", emit, { passive: props.modelValue === void 0 });
		const max = useVModel(props, "max", emit, { passive: props.max === void 0 });
		watch(() => modelValue.value, async (value) => {
			const correctedValue = validateValue(value, props.max);
			if (correctedValue !== value) {
				await nextTick();
				modelValue.value = correctedValue;
			}
		}, { immediate: true });
		watch(() => props.max, (newMax) => {
			const correctedMax = validateMax(props.max);
			if (correctedMax !== newMax) max.value = correctedMax;
		}, { immediate: true });
		const progressState = computed(() => {
			if (isNullish(modelValue.value)) return "indeterminate";
			if (modelValue.value === max.value) return "complete";
			return "loading";
		});
		provideProgressRootContext({
			modelValue,
			max,
			progressState
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				"as-child": _ctx.asChild,
				as: _ctx.as,
				"aria-valuemax": unref(max),
				"aria-valuemin": 0,
				"aria-valuenow": isNumber$1(unref(modelValue)) ? unref(modelValue) : void 0,
				"aria-valuetext": _ctx.getValueText?.(unref(modelValue), unref(max)),
				"aria-label": _ctx.getValueLabel(unref(modelValue), unref(max)),
				role: "progressbar",
				"data-state": progressState.value,
				"data-value": unref(modelValue) ?? void 0,
				"data-max": unref(max)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", { modelValue: unref(modelValue) })]),
				_: 3
			}, 8, [
				"as-child",
				"as",
				"aria-valuemax",
				"aria-valuenow",
				"aria-valuetext",
				"aria-label",
				"data-state",
				"data-value",
				"data-max"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Progress/ProgressIndicator.js
var ProgressIndicator_default = /* @__PURE__ */ defineComponent({
	__name: "ProgressIndicator",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectProgressRootContext();
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
				"data-state": unref(rootContext).progressState.value,
				"data-value": unref(rootContext).modelValue?.value ?? void 0,
				"data-max": unref(rootContext).max.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"data-state",
				"data-value",
				"data-max"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastAnnounceExclude.js
var ToastAnnounceExclude_default = /* @__PURE__ */ defineComponent({
	__name: "ToastAnnounceExclude",
	props: {
		altText: {
			type: String,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), {
				as: _ctx.as,
				"as-child": _ctx.asChild,
				"data-reka-toast-announce-exclude": "",
				"data-reka-toast-announce-alt": _ctx.altText || void 0
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"as",
				"as-child",
				"data-reka-toast-announce-alt"
			]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastProvider.js
var [injectToastProviderContext, provideToastProviderContext] = /*#__PURE__*/ createContext("ToastProvider");
var ToastProvider_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ToastProvider",
	props: {
		label: {
			type: String,
			required: false,
			default: "Notification"
		},
		duration: {
			type: Number,
			required: false,
			default: 5e3
		},
		disableSwipe: {
			type: Boolean,
			required: false
		},
		swipeDirection: {
			type: String,
			required: false,
			default: "right"
		},
		swipeThreshold: {
			type: Number,
			required: false,
			default: 50
		}
	},
	setup(__props) {
		const props = __props;
		const { label, duration, disableSwipe, swipeDirection, swipeThreshold } = toRefs(props);
		useCollection({ isProvider: true });
		const viewport = ref();
		const toastCount = ref(0);
		const isFocusedToastEscapeKeyDownRef = ref(false);
		const isClosePausedRef = ref(false);
		if (props.label && typeof props.label === "string" && !props.label.trim()) throw new Error("Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.");
		provideToastProviderContext({
			label,
			duration,
			disableSwipe,
			swipeDirection,
			swipeThreshold,
			toastCount,
			viewport,
			onViewportChange(el) {
				viewport.value = el;
			},
			onToastAdd() {
				toastCount.value++;
			},
			onToastRemove() {
				toastCount.value--;
			},
			isFocusedToastEscapeKeyDownRef,
			isClosePausedRef
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastAnnounce.js
var ToastAnnounce_default = /* @__PURE__ */ defineComponent({
	__name: "ToastAnnounce",
	setup(__props) {
		const providerContext = injectToastProviderContext();
		const isAnnounced = useTimeout(1e3);
		const renderAnnounceText = ref(false);
		return (_ctx, _cache) => {
			return unref(isAnnounced) || renderAnnounceText.value ? (openBlock(), createBlock(unref(VisuallyHidden_default), {
				key: 0,
				feature: "fully-hidden"
			}, {
				default: withCtx(() => [createTextVNode(toDisplayString(unref(providerContext).label.value) + " ", 1), renderSlot(_ctx.$slots, "default")]),
				_: 3
			})) : createCommentVNode("v-if", true);
		};
	}
});
var VIEWPORT_PAUSE = "toast.viewportPause";
var VIEWPORT_RESUME = "toast.viewportResume";
function handleAndDispatchCustomEvent(name, handler, detail) {
	const currentTarget = detail.originalEvent.currentTarget;
	const event = new CustomEvent(name, {
		bubbles: false,
		cancelable: true,
		detail
	});
	if (handler) currentTarget.addEventListener(name, handler, { once: true });
	currentTarget.dispatchEvent(event);
}
function isDeltaInDirection(delta, direction, threshold = 0) {
	const deltaX = Math.abs(delta.x);
	const deltaY = Math.abs(delta.y);
	const isDeltaX = deltaX > deltaY;
	if (direction === "left" || direction === "right") return isDeltaX && deltaX > threshold;
	else return !isDeltaX && deltaY > threshold;
}
function isHTMLElement(node) {
	return node.nodeType === node.ELEMENT_NODE;
}
function getAnnounceTextContent(container) {
	const textContent = [];
	Array.from(container.childNodes).forEach((node) => {
		if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
		if (isHTMLElement(node)) {
			const isHidden = node.ariaHidden || node.hidden || node.style.display === "none";
			const isExcluded = node.dataset.rekaToastAnnounceExclude === "";
			if (!isHidden) if (isExcluded) {
				const altText = node.dataset.rekaToastAnnounceAlt;
				if (altText) textContent.push(altText);
			} else textContent.push(...getAnnounceTextContent(node));
		}
	});
	return textContent;
}
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastRootImpl.js
var [injectToastRootContext, provideToastRootContext] = /*#__PURE__*/ createContext("ToastRoot");
var ToastRootImpl_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ToastRootImpl",
	props: {
		type: {
			type: String,
			required: false
		},
		open: {
			type: Boolean,
			required: false,
			default: false
		},
		duration: {
			type: Number,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "li"
		}
	},
	emits: [
		"close",
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef, currentElement } = useForwardExpose();
		const { CollectionItem } = useCollection();
		const providerContext = injectToastProviderContext();
		const pointerStartRef = ref(null);
		const swipeDeltaRef = ref(null);
		const duration = computed(() => typeof props.duration === "number" ? props.duration : providerContext.duration.value);
		const closeTimerStartTimeRef = ref(0);
		const closeTimerRemainingTimeRef = ref(duration.value);
		const closeTimerRef = ref(0);
		const remainingTime = ref(duration.value);
		const remainingRaf = useRafFn(() => {
			const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
			remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0);
		}, { fpsLimit: 60 });
		function handleClose(event) {
			const isNonPointerEvent = event?.pointerType === "";
			if (currentElement.value?.contains(getActiveElement()) && isNonPointerEvent) providerContext.viewport.value?.focus();
			if (isNonPointerEvent) providerContext.isClosePausedRef.value = false;
			emits("close");
		}
		const announceTextContent = computed(() => currentElement.value ? getAnnounceTextContent(currentElement.value) : null);
		if (props.type && !["foreground", "background"].includes(props.type)) throw new Error("Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.");
		watchEffect((cleanupFn) => {
			const viewport = providerContext.viewport.value;
			if (viewport) {
				const handleResume = () => {
					closeTimerRemainingTimeRef.value;
					remainingRaf.resume();
					emits("resume");
				};
				const handlePause = () => {
					const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
					closeTimerRemainingTimeRef.value = closeTimerRemainingTimeRef.value - elapsedTime;
					(void 0).clearTimeout(closeTimerRef.value);
					remainingRaf.pause();
					emits("pause");
				};
				viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
				viewport.addEventListener(VIEWPORT_RESUME, handleResume);
				cleanupFn(() => {
					viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
					viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
				});
			}
		});
		watch(() => [props.open, duration.value], () => {
			closeTimerRemainingTimeRef.value = duration.value;
			if (props.open && !providerContext.isClosePausedRef.value) duration.value;
		}, { immediate: true });
		onKeyStroke("Escape", (event) => {
			emits("escapeKeyDown", event);
			if (!event.defaultPrevented) {
				providerContext.isFocusedToastEscapeKeyDownRef.value = true;
				handleClose();
			}
		});
		provideToastRootContext({ onClose: handleClose });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [announceTextContent.value ? (openBlock(), createBlock(ToastAnnounce_default, {
				key: 0,
				role: "alert",
				"aria-live": _ctx.type === "foreground" ? "assertive" : "polite"
			}, {
				default: withCtx(() => [createCommentVNode("\n      Render each chunk as its own text node so screen readers get the\n      natural pause break between nodes (see comment in utils.ts).\n      Interpolating the array directly with `{{ announceTextContent }}`\n      would route through Vue's `toDisplayString`, which JSON-stringifies\n      arrays — the live region would then announce literal `[`, quotes\n      and commas instead of the toast title and description.\n    "), (openBlock(true), createElementBlock(Fragment, null, renderList(announceTextContent.value, (text, i) => {
					return openBlock(), createElementBlock(Fragment, { key: i }, [createTextVNode(toDisplayString(text), 1)], 64);
				}), 128))]),
				_: 1
			}, 8, ["aria-live"])) : createCommentVNode("v-if", true), unref(providerContext).viewport.value ? (openBlock(), createBlock(Teleport, {
				key: 1,
				to: unref(providerContext).viewport.value
			}, [createVNode(unref(CollectionItem), null, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
					ref: unref(forwardRef),
					tabindex: "0"
				}, _ctx.$attrs, {
					as: _ctx.as,
					"as-child": _ctx.asChild,
					"data-state": _ctx.open ? "open" : "closed",
					"data-swipe-direction": unref(providerContext).swipeDirection.value,
					style: unref(providerContext).disableSwipe.value ? void 0 : {
						userSelect: "none",
						touchAction: "none"
					},
					onPointerdown: _cache[0] || (_cache[0] = withModifiers((event) => {
						if (unref(providerContext).disableSwipe.value) return;
						pointerStartRef.value = {
							x: event.clientX,
							y: event.clientY
						};
					}, ["left"])),
					onPointermove: _cache[1] || (_cache[1] = (event) => {
						if (unref(providerContext).disableSwipe.value || !pointerStartRef.value) return;
						const x = event.clientX - pointerStartRef.value.x;
						const y = event.clientY - pointerStartRef.value.y;
						const hasSwipeMoveStarted = Boolean(swipeDeltaRef.value);
						const isHorizontalSwipe = ["left", "right"].includes(unref(providerContext).swipeDirection.value);
						const clamp = ["left", "up"].includes(unref(providerContext).swipeDirection.value) ? Math.min : Math.max;
						const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
						const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
						const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
						const delta = {
							x: clampedX,
							y: clampedY
						};
						const eventDetail = {
							originalEvent: event,
							delta
						};
						if (hasSwipeMoveStarted) {
							swipeDeltaRef.value = delta;
							unref(handleAndDispatchCustomEvent)(unref("toast.swipeMove"), (ev) => emits("swipeMove", ev), eventDetail);
						} else if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, moveStartBuffer)) {
							swipeDeltaRef.value = delta;
							unref(handleAndDispatchCustomEvent)(unref("toast.swipeStart"), (ev) => emits("swipeStart", ev), eventDetail);
							event.target.setPointerCapture(event.pointerId);
						} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) pointerStartRef.value = null;
					}),
					onPointerup: _cache[2] || (_cache[2] = (event) => {
						if (unref(providerContext).disableSwipe.value) return;
						const delta = swipeDeltaRef.value;
						const target = event.target;
						if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
						swipeDeltaRef.value = null;
						pointerStartRef.value = null;
						if (delta) {
							const toast = event.currentTarget;
							const eventDetail = {
								originalEvent: event,
								delta
							};
							if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, unref(providerContext).swipeThreshold.value)) unref(handleAndDispatchCustomEvent)(unref("toast.swipeEnd"), (ev) => emits("swipeEnd", ev), eventDetail);
							else unref(handleAndDispatchCustomEvent)(unref("toast.swipeCancel"), (ev) => emits("swipeCancel", ev), eventDetail);
							toast?.addEventListener("click", (event$1) => event$1.preventDefault(), { once: true });
						}
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
						remaining: remainingTime.value,
						duration: duration.value
					})]),
					_: 3
				}, 16, [
					"as",
					"as-child",
					"data-state",
					"data-swipe-direction",
					"style"
				])]),
				_: 3
			})], 8, ["to"])) : createCommentVNode("v-if", true)], 64);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastClose.js
var ToastClose_default = /* @__PURE__ */ defineComponent({
	__name: "ToastClose",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "button"
		}
	},
	setup(__props) {
		const props = __props;
		const rootContext = injectToastRootContext();
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(ToastAnnounceExclude_default, { "as-child": "" }, {
				default: withCtx(() => [createVNode(unref(Primitive), mergeProps(props, {
					ref: unref(forwardRef),
					type: _ctx.as === "button" ? "button" : void 0,
					onClick: unref(rootContext).onClose
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["type", "onClick"])]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastAction.js
var ToastAction_default = /* @__PURE__ */ defineComponent({
	__name: "ToastAction",
	props: {
		altText: {
			type: String,
			required: true
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		if (!__props.altText) throw new Error("Missing prop `altText` expected on `ToastAction`");
		const { forwardRef } = useForwardExpose();
		return (_ctx, _cache) => {
			return _ctx.altText ? (openBlock(), createBlock(ToastAnnounceExclude_default, {
				key: 0,
				"alt-text": _ctx.altText,
				"as-child": ""
			}, {
				default: withCtx(() => [createVNode(ToastClose_default, {
					ref: unref(forwardRef),
					as: _ctx.as,
					"as-child": _ctx.asChild
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, ["as", "as-child"])]),
				_: 3
			}, 8, ["alt-text"])) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastDescription.js
var ToastDescription_default = /* @__PURE__ */ defineComponent({
	__name: "ToastDescription",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastPortal.js
var ToastPortal_default = /* @__PURE__ */ defineComponent({
	__name: "ToastPortal",
	props: {
		to: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		defer: {
			type: Boolean,
			required: false
		},
		forceMount: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastRoot.js
var ToastRoot_default = /* @__PURE__ */ defineComponent({
	__name: "ToastRoot",
	props: {
		defaultOpen: {
			type: Boolean,
			required: false,
			default: true
		},
		forceMount: {
			type: Boolean,
			required: false
		},
		type: {
			type: String,
			required: false,
			default: "foreground"
		},
		open: {
			type: Boolean,
			required: false,
			default: void 0
		},
		duration: {
			type: Number,
			required: false
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "li"
		}
	},
	emits: [
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd",
		"update:open"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emits = __emit;
		const { forwardRef } = useForwardExpose();
		const open = useVModel(props, "open", emits, {
			defaultValue: props.defaultOpen,
			passive: props.open === void 0
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(open) }, {
				default: withCtx(() => [createVNode(ToastRootImpl_default, mergeProps({
					ref: unref(forwardRef),
					open: unref(open),
					type: _ctx.type,
					as: _ctx.as,
					"as-child": _ctx.asChild,
					duration: _ctx.duration
				}, _ctx.$attrs, {
					onClose: _cache[0] || (_cache[0] = ($event) => open.value = false),
					onPause: _cache[1] || (_cache[1] = ($event) => emits("pause")),
					onResume: _cache[2] || (_cache[2] = ($event) => emits("resume")),
					onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
					onSwipeStart: _cache[4] || (_cache[4] = (event) => {
						emits("swipeStart", event);
						if (!event.defaultPrevented) event.currentTarget.setAttribute("data-swipe", "start");
					}),
					onSwipeMove: _cache[5] || (_cache[5] = (event) => {
						emits("swipeMove", event);
						if (!event.defaultPrevented) {
							const { x, y } = event.detail.delta;
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "move");
							target.style.setProperty("--reka-toast-swipe-move-x", `${x}px`);
							target.style.setProperty("--reka-toast-swipe-move-y", `${y}px`);
						}
					}),
					onSwipeCancel: _cache[6] || (_cache[6] = (event) => {
						emits("swipeCancel", event);
						if (!event.defaultPrevented) {
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "cancel");
							target.style.removeProperty("--reka-toast-swipe-move-x");
							target.style.removeProperty("--reka-toast-swipe-move-y");
							target.style.removeProperty("--reka-toast-swipe-end-x");
							target.style.removeProperty("--reka-toast-swipe-end-y");
						}
					}),
					onSwipeEnd: _cache[7] || (_cache[7] = (event) => {
						emits("swipeEnd", event);
						if (!event.defaultPrevented) {
							const { x, y } = event.detail.delta;
							const target = event.currentTarget;
							target.setAttribute("data-swipe", "end");
							target.style.removeProperty("--reka-toast-swipe-move-x");
							target.style.removeProperty("--reka-toast-swipe-move-y");
							target.style.setProperty("--reka-toast-swipe-end-x", `${x}px`);
							target.style.setProperty("--reka-toast-swipe-end-y", `${y}px`);
							open.value = false;
						}
					})
				}), {
					default: withCtx(({ remaining, duration: _duration }) => [renderSlot(_ctx.$slots, "default", {
						remaining,
						duration: _duration,
						open: unref(open)
					})]),
					_: 3
				}, 16, [
					"open",
					"type",
					"as",
					"as-child",
					"duration"
				])]),
				_: 3
			}, 8, ["present"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastTitle.js
var ToastTitle_default = /* @__PURE__ */ defineComponent({
	__name: "ToastTitle",
	props: {
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		useForwardExpose();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/FocusProxy.js
var FocusProxy_default = /* @__PURE__ */ defineComponent({
	__name: "FocusProxy",
	emits: ["focusFromOutsideViewport"],
	setup(__props, { emit: __emit }) {
		const emits = __emit;
		const providerContext = injectToastProviderContext();
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(VisuallyHidden_default), {
				tabindex: "0",
				style: { "position": "fixed" },
				onFocus: _cache[0] || (_cache[0] = (event) => {
					const prevFocusedElement = event.relatedTarget;
					if (!unref(providerContext).viewport.value?.contains(prevFocusedElement)) emits("focusFromOutsideViewport");
				})
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			});
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Toast/ToastViewport.js
var ToastViewport_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "ToastViewport",
	props: {
		hotkey: {
			type: Array,
			required: false,
			default: () => ["F8"]
		},
		label: {
			type: [String, Function],
			required: false,
			default: "Notifications ({hotkey})"
		},
		asChild: {
			type: Boolean,
			required: false
		},
		as: {
			type: null,
			required: false,
			default: "ol"
		}
	},
	setup(__props) {
		const { hotkey, label } = toRefs(__props);
		const { forwardRef, currentElement } = useForwardExpose();
		const { CollectionSlot, getItems } = useCollection();
		const providerContext = injectToastProviderContext();
		const hasToasts = computed(() => providerContext.toastCount.value > 0);
		const headFocusProxyRef = ref();
		const tailFocusProxyRef = ref();
		const KEY_RE = /Key/g;
		const DIGIT_RE = /Digit/g;
		const hotkeyMessage = computed(() => hotkey.value.join("+").replace(KEY_RE, "").replace(DIGIT_RE, ""));
		onKeyStroke(hotkey.value, () => {
			currentElement.value.focus();
		});
		watchEffect((cleanupFn) => {
			const viewport = currentElement.value;
			if (hasToasts.value && viewport) {
				const handlePause = () => {
					if (!providerContext.isClosePausedRef.value) {
						const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
						viewport.dispatchEvent(pauseEvent);
						providerContext.isClosePausedRef.value = true;
					}
				};
				const handleResume = () => {
					if (providerContext.isClosePausedRef.value) {
						const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
						viewport.dispatchEvent(resumeEvent);
						providerContext.isClosePausedRef.value = false;
					}
				};
				const handleFocusOutResume = (event) => {
					if (!viewport.contains(event.relatedTarget)) handleResume();
				};
				const handlePointerLeaveResume = () => {
					if (!viewport.contains(getActiveElement())) handleResume();
				};
				const handleKeyDown = (event) => {
					const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
					if (event.key === "Tab" && !isMetaKey) {
						const focusedElement = getActiveElement();
						const isTabbingBackwards = event.shiftKey;
						if (event.target === viewport && isTabbingBackwards) {
							headFocusProxyRef.value?.focus();
							return;
						}
						const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection: isTabbingBackwards ? "backwards" : "forwards" });
						const index = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
						if (focusFirst(sortedCandidates.slice(index + 1))) event.preventDefault();
						else isTabbingBackwards ? headFocusProxyRef.value?.focus() : tailFocusProxyRef.value?.focus();
					}
				};
				viewport.addEventListener("focusin", handlePause);
				viewport.addEventListener("focusout", handleFocusOutResume);
				viewport.addEventListener("pointermove", handlePause);
				viewport.addEventListener("pointerleave", handlePointerLeaveResume);
				viewport.addEventListener("keydown", handleKeyDown);
				(void 0).addEventListener("blur", handlePause);
				(void 0).addEventListener("focus", handleResume);
				cleanupFn(() => {
					viewport.removeEventListener("focusin", handlePause);
					viewport.removeEventListener("focusout", handleFocusOutResume);
					viewport.removeEventListener("pointermove", handlePause);
					viewport.removeEventListener("pointerleave", handlePointerLeaveResume);
					viewport.removeEventListener("keydown", handleKeyDown);
					(void 0).removeEventListener("blur", handlePause);
					(void 0).removeEventListener("focus", handleResume);
				});
			}
		});
		function getSortedTabbableCandidates({ tabbingDirection }) {
			const tabbableCandidates = getItems().map((i) => i.ref).map((toastNode) => {
				const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)];
				return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
			});
			return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
		}
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(DismissableLayerBranch_default), {
				role: "region",
				"aria-label": typeof unref(label) === "string" ? unref(label).replace("{hotkey}", hotkeyMessage.value) : unref(label)(hotkeyMessage.value),
				tabindex: "-1",
				style: normalizeStyle({ pointerEvents: hasToasts.value ? void 0 : "none" })
			}, {
				default: withCtx(() => [
					hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
						key: 0,
						ref: (node) => {
							if (!node) return void 0;
							headFocusProxyRef.value = unref(unrefElement)(node);
						},
						onFocusFromOutsideViewport: _cache[0] || (_cache[0] = () => {
							const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "forwards" });
							unref(focusFirst)(tabbableCandidates);
						})
					}, null, 512)) : createCommentVNode("v-if", true),
					createVNode(unref(CollectionSlot), null, {
						default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
							ref: unref(forwardRef),
							tabindex: "-1",
							as: _ctx.as,
							"as-child": _ctx.asChild
						}, _ctx.$attrs), {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 16, ["as", "as-child"])]),
						_: 3
					}),
					hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
						key: 1,
						ref: (node) => {
							if (!node) return void 0;
							tailFocusProxyRef.value = unref(unrefElement)(node);
						},
						onFocusFromOutsideViewport: _cache[1] || (_cache[1] = () => {
							const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "backwards" });
							unref(focusFirst)(tabbableCandidates);
						})
					}, null, 512)) : createCommentVNode("v-if", true)
				]),
				_: 3
			}, 8, ["aria-label", "style"]);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/reka-ui@2.10.5_vue@3.5.44_typescript@5.9.3_/node_modules/reka-ui/dist/Tooltip/TooltipProvider.js
var [injectTooltipProviderContext, provideTooltipProviderContext] = /*#__PURE__*/ createContext("TooltipProvider");
var TooltipProvider_default = /* @__PURE__ */ defineComponent({
	inheritAttrs: false,
	__name: "TooltipProvider",
	props: {
		delayDuration: {
			type: Number,
			required: false,
			default: 700
		},
		skipDelayDuration: {
			type: Number,
			required: false,
			default: 300
		},
		disableHoverableContent: {
			type: Boolean,
			required: false,
			default: false
		},
		disableClosingTrigger: {
			type: Boolean,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		ignoreNonKeyboardFocus: {
			type: Boolean,
			required: false,
			default: false
		},
		content: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const { delayDuration, skipDelayDuration, disableHoverableContent, disableClosingTrigger, ignoreNonKeyboardFocus, disabled, content } = toRefs(__props);
		useForwardExpose();
		const isOpenDelayed = ref(true);
		const isPointerInTransitRef = ref(false);
		const { start: startTimer, stop: clearTimer } = useTimeoutFn(() => {
			isOpenDelayed.value = true;
		}, skipDelayDuration, { immediate: false });
		provideTooltipProviderContext({
			isOpenDelayed,
			delayDuration,
			onOpen() {
				clearTimer();
				isOpenDelayed.value = false;
			},
			onClose() {
				startTimer();
			},
			isPointerInTransitRef,
			disableHoverableContent,
			disableClosingTrigger,
			disabled,
			ignoreNonKeyboardFocus,
			content
		});
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
});
//#endregion
//#region node_modules/.pnpm/ohash@2.0.12/node_modules/ohash/dist/utils/index.mjs
var PROTO_KEY = "__proto__";
function diff(obj1, obj2) {
	const diffs = [];
	_diff(obj1, obj2, "", diffs);
	return diffs;
}
function _diff(v1, v2, key, out) {
	if (v1 === v2) return;
	const leaf1 = v1 === null || typeof v1 !== "object";
	const leaf2 = v2 === null || typeof v2 !== "object";
	if (!leaf1 && !leaf2) {
		const entries1 = _entries(v1);
		const entries2 = _entries(v2);
		for (const [k, child1] of entries1) {
			const childKey = key ? `${key}.${k}` : k;
			if (entries2.has(k)) _diff(child1, entries2.get(k), childKey, out);
			else out.push(new DiffEntry(childKey, "removed", void 0, _toHashedObject(child1, childKey)));
		}
		for (const [k, child2] of entries2) {
			if (entries1.has(k)) continue;
			const childKey = key ? `${key}.${k}` : k;
			out.push(new DiffEntry(childKey, "added", _toHashedObject(child2, childKey)));
		}
		return;
	}
	if (_hasKeys(v1, leaf1) || _hasKeys(v2, leaf2)) return;
	const node1 = _emptyOrLeafNode(v1, key, leaf1);
	const node2 = _emptyOrLeafNode(v2, key, leaf2);
	if (node1.hash !== node2.hash) out.push(new DiffEntry(key, "changed", node2, node1));
}
function _entries(value) {
	const entries = /* @__PURE__ */ new Map();
	for (const key in value) if (key !== PROTO_KEY) entries.set(key, value[key]);
	return entries;
}
function _hasKeys(value, isLeaf) {
	if (isLeaf) return false;
	for (const key in value) if (key !== PROTO_KEY) return true;
	return false;
}
function _emptyOrLeafNode(value, key, isLeaf) {
	return isLeaf ? new DiffHashedObject(key, value, _leafHash(value)) : new DiffHashedObject(key, value, "{}", Object.create(null));
}
function _toHashedObject(obj, key = "") {
	if (obj === null || typeof obj !== "object") return new DiffHashedObject(key, obj, _leafHash(obj));
	const props = Object.create(null);
	const hashes = [];
	for (const _key in obj) {
		if (_key === PROTO_KEY) continue;
		const child = _toHashedObject(obj[_key], key ? `${key}.${_key}` : _key);
		props[_key] = child;
		hashes.push(child.hash);
	}
	return new DiffHashedObject(key, obj, `{${hashes.join(":")}}`, props);
}
function _leafHash(value) {
	switch (typeof value) {
		case "string": return `'${value}'`;
		case "number":
		case "boolean": return "" + value;
		case "bigint": return `${value}n`;
		default: return serialize(value);
	}
}
var DiffEntry = class {
	key;
	type;
	newValue;
	oldValue;
	constructor(key, type, newValue, oldValue) {
		this.key = key;
		this.type = type;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}
	toString() {
		return this.toJSON();
	}
	toJSON() {
		switch (this.type) {
			case "added": return `Added   \`${this.key}\``;
			case "removed": return `Removed \`${this.key}\``;
			case "changed": return `Changed \`${this.key}\` from \`${this.oldValue?.toString() || "-"}\` to \`${this.newValue?.toString()}\``;
		}
	}
};
var DiffHashedObject = class {
	key;
	value;
	hash;
	props;
	constructor(key, value, hash, props) {
		this.key = key;
		this.value = value;
		this.hash = hash;
		this.props = props;
	}
	toString() {
		if (this.props) return `{${Object.keys(this.props).join(",")}}`;
		else return JSON.stringify(this.value);
	}
	toJSON() {
		const k = this.key || ".";
		if (this.props) return `${k}({${Object.keys(this.props).join(",")}})`;
		return `${k}(${this.value})`;
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/utils/index.js
function omit(data, keys) {
	const result = { ...data };
	for (const key of keys) delete result[key];
	return result;
}
function get(object, path, defaultValue) {
	const keys = typeof path === "string" ? path.split(".") : path;
	let result = object;
	for (const key of keys) {
		if (result === void 0 || result === null) return defaultValue;
		result = result[key];
	}
	return result !== void 0 ? result : defaultValue;
}
function looseToNumber(val) {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? val : n;
}
function isEmpty(value) {
	if (value == null) return true;
	if (typeof value === "boolean" || typeof value === "number") return false;
	if (typeof value === "string") return value.trim().length === 0;
	if (Array.isArray(value)) return value.length === 0;
	if (value instanceof Map || value instanceof Set) return value.size === 0;
	if (value instanceof Date || value instanceof RegExp || typeof value === "function") return false;
	if (typeof value === "object") {
		for (const _ in value) if (Object.prototype.hasOwnProperty.call(value, _)) return false;
		return true;
	}
	return false;
}
function mergeClasses(appConfigClass, propClass) {
	if (!appConfigClass && !propClass) return "";
	return [...Array.isArray(appConfigClass) ? appConfigClass : [appConfigClass], propClass].filter(Boolean);
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/utils/locale.js
function buildTranslator(locale) {
	return (path, option) => translate(path, option, unref(locale));
}
function translate(path, option, locale) {
	return get(locale, `messages.${path}`, path).replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
}
function buildLocaleContext(locale) {
	return {
		lang: computed(() => unref(locale).name),
		code: computed(() => unref(locale).code),
		dir: computed(() => unref(locale).dir),
		locale: isRef(locale) ? locale : ref(locale),
		t: buildTranslator(locale)
	};
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/defineLocale.js
// @__NO_SIDE_EFFECTS__
function defineLocale(options) {
	return defu(options, { dir: "ltr" });
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/locale/en.js
var en_default = /* @__PURE__ */ defineLocale({
	name: "English",
	code: "en",
	messages: {
		alert: { close: "Close" },
		authForm: {
			hidePassword: "Hide password",
			showPassword: "Show password",
			submit: "Continue"
		},
		banner: { close: "Close" },
		calendar: {
			nextMonth: "Next month",
			nextYear: "Next year",
			prevMonth: "Previous month",
			prevYear: "Previous year"
		},
		carousel: {
			dots: "Choose slide to display",
			goto: "Go to slide {slide}",
			next: "Next",
			prev: "Prev"
		},
		chatPrompt: { placeholder: "Type your message here…" },
		chatPromptSubmit: { label: "Send prompt" },
		colorMode: {
			dark: "Dark",
			light: "Light",
			switchToDark: "Switch to dark mode",
			switchToLight: "Switch to light mode",
			system: "System"
		},
		commandPalette: {
			back: "Back",
			close: "Close",
			noData: "No data",
			noMatch: "No matching data",
			placeholder: "Type a command or search…"
		},
		contentSearch: {
			links: "Links",
			search: "Results",
			theme: "Theme"
		},
		contentSearchButton: { label: "Search…" },
		contentToc: { title: "On this page" },
		dropdownMenu: {
			noMatch: "No matching data",
			search: "Search…"
		},
		dashboardSearch: { theme: "Theme" },
		dashboardSearchButton: { label: "Search…" },
		dashboardSidebarCollapse: {
			collapse: "Collapse sidebar",
			expand: "Expand sidebar"
		},
		dashboardSidebarToggle: {
			close: "Close sidebar",
			open: "Open sidebar"
		},
		drawer: { close: "Close" },
		error: { clear: "Back to home" },
		fileUpload: { removeFile: "Remove {filename}" },
		header: {
			close: "Close menu",
			open: "Open menu"
		},
		inputMenu: {
			create: "Create \"{label}\"",
			noData: "No data",
			noMatch: "No matching data"
		},
		inputNumber: {
			decrement: "Decrement",
			increment: "Increment"
		},
		listbox: {
			noData: "No data",
			noMatch: "No matching data",
			search: "Search…"
		},
		modal: { close: "Close" },
		pricingTable: { caption: "Pricing plan comparison" },
		prose: {
			codeCollapse: {
				closeText: "Collapse",
				name: "code",
				openText: "Expand"
			},
			collapsible: {
				closeText: "Hide",
				name: "properties",
				openText: "Show"
			},
			pre: { copy: "Copy code to clipboard" },
			prompt: {
				copy: "Copy prompt",
				openIn: "Open in {name}"
			}
		},
		chatReasoning: {
			thinking: "Thinking…",
			thought: "Thought",
			thoughtFor: "Thought for {duration}"
		},
		sidebar: {
			close: "Close",
			toggle: "Toggle"
		},
		selectMenu: {
			create: "Create \"{label}\"",
			noData: "No data",
			noMatch: "No matching data",
			search: "Search…"
		},
		slideover: { close: "Close" },
		table: { noData: "No data" },
		toast: { close: "Close" }
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useLocale.js
var localeContextInjectionKey = Symbol.for("nuxt-ui.locale-context");
var _useLocale = (localeOverrides) => {
	const locale = localeOverrides || toRef(inject(localeContextInjectionKey, en_default));
	return buildLocaleContext(computed(() => locale.value || en_default));
};
var useLocale = _useLocale;
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/usePortal.js
var portalTargetInjectionKey = Symbol("nuxt-ui.portal-target");
function usePortal(portal) {
	const globalPortal = inject(portalTargetInjectionKey, void 0);
	const value = computed(() => portal.value === true ? globalPortal?.value : portal.value);
	const disabled = computed(() => typeof value.value === "boolean" ? !value.value : false);
	const to = computed(() => typeof value.value === "boolean" ? "body" : value.value);
	return computed(() => ({
		to: to.value,
		disabled: disabled.value
	}));
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useComponentProps.js
var [_injectThemeContext] = createContext("UTheme", "RootContext");
var defaultThemeContext = { defaults: computed(() => ({})) };
function injectThemeContext(fallback = defaultThemeContext) {
	return _injectThemeContext(fallback);
}
function camelCase(str) {
	return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}
function kebabCase(str) {
	return str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
}
function propIsDefined(vnode, prop) {
	if (!vnode || !vnode.props) return false;
	return vnode.props[camelCase(prop)] !== void 0 || vnode.props[kebabCase(prop)] !== void 0;
}
function useComponentProps(name, props) {
	const vm = getCurrentInstance();
	const { defaults } = injectThemeContext();
	const appConfig = useAppConfig();
	return new Proxy(props, {
		get(target, prop, receiver) {
			if (prop === "__v_isReactive") return true;
			if (prop === "__v_raw") return target;
			const raw = Reflect.get(target, prop, receiver);
			if (typeof prop !== "string") return raw;
			const themeEntry = name.includes(".") ? get(defaults.value, name) : defaults.value[name];
			if (prop === "ui") {
				const themeUi = themeEntry?.ui;
				if (!raw && !themeUi) return raw;
				return defu(raw ?? {}, themeUi ?? {});
			}
			if (prop === "class") {
				const themeClass = themeEntry?.class;
				if (themeClass === void 0) return raw;
				if (raw === void 0) return themeClass;
				return [themeClass, raw];
			}
			if (vm && propIsDefined(vm.vnode, prop)) return raw;
			const themeValue = themeEntry?.[prop];
			if (themeValue !== void 0) return themeValue;
			const appConfigValue = (name.includes(".") ? get(appConfig.ui ?? {}, name) : appConfig.ui?.[name])?.defaultVariants?.[prop];
			if (appConfigValue !== void 0) return appConfigValue;
			const propDef = vm?.type?.props?.[prop];
			if (propDef && Object.prototype.hasOwnProperty.call(propDef, "default")) return raw;
		},
		has: (t, p) => Reflect.has(t, p),
		ownKeys: (t) => Reflect.ownKeys(t),
		getOwnPropertyDescriptor: (t, p) => Reflect.getOwnPropertyDescriptor(t, p)
	});
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useForwardProps.js
function useForwardProps(source, emits) {
	const emitAsProps = emits ? useEmitAsProps(emits) : {};
	return computed(() => {
		const src = unref(source);
		const out = { ...emitAsProps };
		for (const key in src) {
			const value = src[key];
			if (value !== void 0) out[key] = value;
		}
		return out;
	});
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useToast.js
var toastMaxInjectionKey = Symbol("nuxt-ui.toast-max");
function useToast() {
	const toasts = useState("toasts", () => []);
	const max = inject(toastMaxInjectionKey, void 0);
	const running = ref(false);
	const queue = [];
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	function mergeDuplicate(index, toast) {
		toasts.value[index] = {
			...toasts.value[index],
			...toast,
			_duplicate: (toasts.value[index]._duplicate || 0) + 1
		};
	}
	async function processQueue() {
		if (running.value || queue.length === 0) return;
		running.value = true;
		while (queue.length > 0) {
			await nextTick();
			const toast = queue.shift();
			const maxValue = max?.value ?? 5;
			if (maxValue <= 0) {
				if (toasts.value.length) toasts.value = [];
				continue;
			}
			const existingIndex = toasts.value.findIndex((t) => t.id === toast.id);
			if (existingIndex !== -1) {
				mergeDuplicate(existingIndex, toast);
				continue;
			}
			toasts.value = [...toasts.value, toast].slice(-maxValue);
		}
		running.value = false;
	}
	function add(toast) {
		const body = {
			id: generateId(),
			open: true,
			...toast
		};
		const existingIndex = toasts.value.findIndex((t) => t.id === body.id);
		if (existingIndex !== -1) {
			mergeDuplicate(existingIndex, body);
			return body;
		}
		queue.push(body);
		processQueue();
		return body;
	}
	function update(id, toast) {
		const index = toasts.value.findIndex((t) => t.id === id);
		if (index !== -1) {
			toasts.value[index] = {
				...toasts.value[index],
				...toast,
				duration: toast.duration,
				open: true,
				_updated: true
			};
			nextTick(() => {
				const i = toasts.value.findIndex((t) => t.id === id);
				if (i !== -1 && toasts.value[i]._updated) toasts.value[i] = {
					...toasts.value[i],
					_updated: void 0
				};
			});
		}
	}
	function remove(id) {
		const index = toasts.value.findIndex((t) => t.id === id);
		if (index !== -1 && toasts.value[index]._updated) return;
		if (index !== -1) toasts.value[index] = {
			...toasts.value[index],
			open: false
		};
		setTimeout(() => {
			toasts.value = toasts.value.filter((t) => t.id !== id);
		}, 200);
	}
	function clear() {
		toasts.value = [];
	}
	return {
		toasts,
		add,
		update,
		remove,
		clear
	};
}
//#endregion
//#region node_modules/.pnpm/tailwind-variants@3.3.1_tailwind-merge@3.7.0_tailwindcss@4.3.3/node_modules/tailwind-variants/dist/chunk-OYFAXDFZ.js
var isArray = Array.isArray;
var joinClassValue = (value) => {
	if (!value && value !== 0 && value !== 0n) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number") {
		if (value !== value) return "";
		return "" + value;
	}
	if (typeof value === "bigint") return "" + value;
	let result = "";
	if (isArray(value)) {
		const length = value.length;
		for (let index = 0; index < length; index++) {
			const item = value[index];
			if (!item && item !== 0 && item !== 0n) continue;
			const resolved = typeof item === "string" ? item : joinClassValue(item);
			if (resolved) {
				if (result) result += " ";
				result += resolved;
			}
		}
		return result;
	}
	if (typeof value === "object") {
		for (const key in value) if (value[key]) {
			if (result) result += " ";
			result += key;
		}
	}
	return result;
};
var SPACE_REGEX = /\s+/g;
var isArray2 = Array.isArray;
var removeExtraSpaces = (str) => {
	if (typeof str !== "string" || !str) return str;
	return str.replace(SPACE_REGEX, " ").trim();
};
var stringNeedsNormalize = (str) => {
	const len = str.length;
	if (len === 0) return false;
	const first = str.charCodeAt(0);
	const last = str.charCodeAt(len - 1);
	if (first === 32 || last === 32 || first >= 9 && first <= 13 || first === 160 || last >= 9 && last <= 13 || last === 160) return true;
	for (let i = 0; i < len; i++) {
		const code = str.charCodeAt(i);
		if (code >= 9 && code <= 13 || code === 160) return true;
		if (code === 32 && i + 1 < len && str.charCodeAt(i + 1) === 32) return true;
	}
	return false;
};
var cx = (...classnames) => {
	const result = joinClassValue(classnames);
	if (!result) return void 0;
	return stringNeedsNormalize(result) ? removeExtraSpaces(result) : result;
};
var falsyToString = (value) => value === false ? "false" : value === true ? "true" : value === 0 ? "0" : value;
var isEmptyObject = (obj) => {
	if (!obj || typeof obj !== "object") return true;
	for (const _ in obj) return false;
	return true;
};
var isEqual = (obj1, obj2) => {
	if (obj1 === obj2) return true;
	if (!obj1 || !obj2) return false;
	const record1 = obj1;
	const record2 = obj2;
	const keys1 = Object.keys(record1);
	const keys2 = Object.keys(record2);
	if (keys1.length !== keys2.length) return false;
	for (let i = 0; i < keys1.length; i++) {
		const key = keys1[i];
		if (!keys2.includes(key)) return false;
		if (record1[key] !== record2[key]) return false;
	}
	return true;
};
var joinObjects = (obj1, obj2) => {
	const target = obj1;
	for (const key in obj2) if (Object.hasOwn(obj2, key)) {
		const val2 = obj2[key];
		if (key in target) target[key] = cx(target[key], val2);
		else target[key] = val2;
	}
	return obj1;
};
var flat = (arr, target) => {
	for (let i = 0; i < arr.length; i++) {
		const el = arr[i];
		if (isArray2(el)) flat(el, target);
		else if (el) target.push(el);
	}
};
var flatMergeArrays = (...arrays) => {
	const result = [];
	flat(arrays, result);
	const filtered = [];
	for (let i = 0; i < result.length; i++) if (result[i]) filtered.push(result[i]);
	return filtered;
};
var mergeObjects = (obj1, obj2) => {
	const record1 = obj1;
	const record2 = obj2;
	const result = {};
	for (const key in record1) {
		const val1 = record1[key];
		if (key in record2) {
			const val2 = record2[key];
			if (isArray2(val1) || isArray2(val2)) result[key] = flatMergeArrays(val2, val1);
			else if (typeof val1 === "object" && typeof val2 === "object" && val1 && val2) result[key] = mergeObjects(val1, val2);
			else result[key] = val2 + " " + val1;
		} else result[key] = val1;
	}
	for (const key in record2) if (!(key in record1)) result[key] = record2[key];
	return result;
};
//#endregion
//#region node_modules/.pnpm/tailwind-variants@3.3.1_tailwind-merge@3.7.0_tailwindcss@4.3.3/node_modules/tailwind-variants/dist/chunk-SUL6UUW2.js
var defaultConfig = {
	twMerge: true,
	twMergeConfig: {}
};
var VARIANT_CACHE_LIMIT = 256;
var OVERRIDE_CACHE_LIMIT = 128;
var CACHE_MISS = /* @__PURE__ */ Symbol("tv-cache-miss");
var hasClassOverride = (props) => (props == null ? void 0 : props.class) != null && props.class !== "" || (props == null ? void 0 : props.className) != null && props.className !== "";
var serializeFingerprintValue = (value) => {
	if (value === void 0) return "";
	if (value === null) return "null";
	if (typeof value === "string") return value;
	if (typeof value === "boolean") return value ? "true" : "false";
	if (typeof value === "number") return value === 0 ? "0" : String(value);
	if (typeof value === "bigint") return String(value);
	const mapped = falsyToString(value);
	const mappedType = typeof mapped;
	if (mappedType === "string" || mappedType === "number" || mappedType === "boolean" || mappedType === "bigint") return String(mapped);
	if (mappedType === "object") try {
		return JSON.stringify(mapped);
	} catch {
		return null;
	}
	return null;
};
var appendSignatureValue = (out, value) => {
	if (value === void 0) return out;
	if (value === null) return out + "null";
	const type = typeof value;
	if (type === "string" || type === "number" || type === "boolean" || type === "bigint") return out + String(value);
	if (Array.isArray(value)) return out + value.join("\0");
	try {
		return out + JSON.stringify(value);
	} catch {
		return out + "?";
	}
};
var buildPropsFingerprint = (variantKeys, defaultVariants, props, slotProps) => {
	let fingerprint = "";
	const seen = /* @__PURE__ */ Object.create(null);
	for (let i = 0; i < variantKeys.length; i++) {
		const key = variantKeys[i];
		seen[key] = 1;
		let value = defaultVariants[key];
		if (props && props[key] !== void 0) value = props[key];
		const serialized = serializeFingerprintValue(value);
		if (serialized === null) return null;
		fingerprint += key + ":" + serialized + ";";
	}
	const extras = [];
	for (const key in defaultVariants) {
		if (key === "class" || key === "className" || seen[key]) continue;
		seen[key] = 1;
		extras.push(key);
	}
	if (props) for (const key in props) {
		if (key === "class" || key === "className" || seen[key] || props[key] === void 0) continue;
		seen[key] = 1;
		extras.push(key);
	}
	if (extras.length > 1) extras.sort();
	for (let i = 0; i < extras.length; i++) {
		const key = extras[i];
		let value = defaultVariants[key];
		if (props && props[key] !== void 0) value = props[key];
		const serialized = serializeFingerprintValue(value);
		if (serialized === null) return null;
		fingerprint += key + ":" + serialized + ";";
	}
	return fingerprint;
};
var buildCompoundsSignature = (compoundVariants, compoundSlots) => {
	let signature = "";
	for (let i = 0; i < compoundVariants.length; i++) {
		const { conditionKeys, source } = compoundVariants[i];
		for (let j = 0; j < conditionKeys.length; j++) {
			const key = conditionKeys[j];
			signature += key + "=";
			signature = appendSignatureValue(signature, source[key]);
			signature += ",";
		}
		signature += "c=";
		signature = appendSignatureValue(signature, source.class);
		signature += "|cn=";
		signature = appendSignatureValue(signature, source.className);
		signature += ";";
	}
	for (let i = 0; i < compoundSlots.length; i++) {
		const { conditionKeys, source } = compoundSlots[i];
		for (let j = 0; j < conditionKeys.length; j++) {
			const key = conditionKeys[j];
			signature += key + "=";
			signature = appendSignatureValue(signature, source[key]);
			signature += ",";
		}
		if (Array.isArray(source.slots)) signature += "slots=" + source.slots.join(",") + ",";
		signature += "c=";
		signature = appendSignatureValue(signature, source.class);
		signature += "|cn=";
		signature = appendSignatureValue(signature, source.className);
		signature += ";";
	}
	return signature;
};
var createBoundedCache = (limit = VARIANT_CACHE_LIMIT) => {
	let primary = /* @__PURE__ */ new Map();
	let secondary = null;
	return {
		get(key) {
			if (primary.has(key)) return primary.get(key);
			if (secondary == null ? void 0 : secondary.has(key)) {
				const value = secondary.get(key);
				primary.set(key, value);
				return value;
			}
			return CACHE_MISS;
		},
		set(key, value) {
			if (primary.size >= limit) {
				secondary = primary;
				primary = /* @__PURE__ */ new Map();
			}
			primary.set(key, value);
		}
	};
};
var createResultCache = (limit = VARIANT_CACHE_LIMIT) => {
	const cache = createBoundedCache(limit);
	return {
		get(key) {
			return cache.get(key);
		},
		set(key, value) {
			cache.set(key, value);
		}
	};
};
var createNestedOverrideCache = (limit = OVERRIDE_CACHE_LIMIT) => {
	let primary = /* @__PURE__ */ new Map();
	let secondary = null;
	let size = 0;
	return {
		get(coreKey, overrideKey) {
			const primaryInner = primary.get(coreKey);
			if (primaryInner) {
				const value = primaryInner.get(overrideKey);
				if (value !== void 0 || primaryInner.has(overrideKey)) return value;
			}
			if (secondary) {
				const secondaryInner = secondary.get(coreKey);
				if (secondaryInner) {
					const value = secondaryInner.get(overrideKey);
					if (value !== void 0 || secondaryInner.has(overrideKey)) {
						let promoteInner = primary.get(coreKey);
						if (!promoteInner) {
							promoteInner = /* @__PURE__ */ new Map();
							primary.set(coreKey, promoteInner);
						}
						if (!promoteInner.has(overrideKey)) size++;
						promoteInner.set(overrideKey, value);
						return value;
					}
				}
			}
			return CACHE_MISS;
		},
		set(coreKey, overrideKey, value) {
			if (size >= limit) {
				secondary = primary;
				primary = /* @__PURE__ */ new Map();
				size = 0;
			}
			let inner = primary.get(coreKey);
			if (!inner) {
				inner = /* @__PURE__ */ new Map();
				primary.set(coreKey, inner);
			}
			if (!inner.has(overrideKey)) size++;
			inner.set(overrideKey, value);
		}
	};
};
var createLazyOverrideMerge = (cn, config) => {
	let cache = null;
	return (core, props) => {
		if (!hasClassOverride(props)) return core;
		const classVal = props.class;
		const classNameVal = props.className;
		if (classVal != null && classVal !== "" && typeof classVal !== "string" || classNameVal != null && classNameVal !== "" && typeof classNameVal !== "string") return cn(config, core, classVal, classNameVal);
		cache ??= createNestedOverrideCache();
		const coreKey = core ?? "";
		const overrideKey = (typeof classVal === "string" ? classVal : "") + "\0" + (typeof classNameVal === "string" ? classNameVal : "");
		const cached = cache.get(coreKey, overrideKey);
		if (cached !== CACHE_MISS) return cached;
		const merged = cn(config, core, classVal, classNameVal);
		cache.set(coreKey, overrideKey, merged);
		return merged;
	};
};
function createState() {
	let cachedTwMerge = null;
	let cachedTwMergeConfig = {};
	let didTwMergeConfigChange = false;
	return {
		get cachedTwMerge() {
			return cachedTwMerge;
		},
		set cachedTwMerge(value) {
			cachedTwMerge = value;
		},
		get cachedTwMergeConfig() {
			return cachedTwMergeConfig;
		},
		set cachedTwMergeConfig(value) {
			cachedTwMergeConfig = value;
		},
		get didTwMergeConfigChange() {
			return didTwMergeConfigChange;
		},
		set didTwMergeConfigChange(value) {
			didTwMergeConfigChange = value;
		},
		reset() {
			cachedTwMerge = null;
			cachedTwMergeConfig = {};
			didTwMergeConfigChange = false;
		}
	};
}
var state = createState();
var synchronizeTwMergeConfig = (config) => {
	if (!isEmptyObject(config.twMergeConfig) && !isEqual(config.twMergeConfig, state.cachedTwMergeConfig)) {
		state.didTwMergeConfigChange = true;
		state.cachedTwMergeConfig = config.twMergeConfig;
	}
};
var compileVariants = (variants, variantKeys) => {
	const compiledVariants = [];
	for (let i = 0; i < variantKeys.length; i++) {
		const key = variantKeys[i];
		const values = variants[key];
		compiledVariants.push({
			key,
			values,
			isEmpty: isEmptyObject(values)
		});
	}
	return compiledVariants;
};
var compileCompoundVariants = (compoundVariants) => {
	if (!Array.isArray(compoundVariants) || compoundVariants.length === 0) return [];
	const result = [];
	for (let i = 0; i < compoundVariants.length; i++) {
		const compoundVariant = compoundVariants[i];
		const conditionKeys = [];
		for (const key in compoundVariant) if (key !== "class" && key !== "className") conditionKeys.push(key);
		result.push({
			conditionKeys,
			source: compoundVariant
		});
	}
	return result;
};
var compileCompoundSlots = (compoundSlots) => {
	if (!Array.isArray(compoundSlots) || compoundSlots.length === 0) return [];
	const result = [];
	for (let i = 0; i < compoundSlots.length; i++) {
		const compoundSlot = compoundSlots[i];
		const conditionKeys = [];
		for (const key in compoundSlot) if (key !== "slots" && key !== "class" && key !== "className") conditionKeys.push(key);
		result.push({
			conditionKeys,
			source: compoundSlot
		});
	}
	return result;
};
var indexCompoundSlotsBySlot = (compiledCompoundSlots) => {
	const index = {};
	for (let i = 0; i < compiledCompoundSlots.length; i++) {
		const compoundSlot = compiledCompoundSlots[i];
		const slots = compoundSlot.source.slots;
		if (!Array.isArray(slots)) continue;
		for (let j = 0; j < slots.length; j++) {
			const slotKey = slots[j];
			if (!index[slotKey]) index[slotKey] = [];
			index[slotKey].push(compoundSlot);
		}
	}
	return index;
};
var resolveOptions = (options, configProp) => {
	const { extend = null, slots: slotProps = {}, variants: variantsProps = {}, compoundVariants: compoundVariantsProps = [], compoundSlots: compoundSlotsProps = [], defaultVariants: defaultVariantsProps = {} } = options;
	const config = {
		...defaultConfig,
		...configProp
	};
	const hasSlots = options.slots !== void 0;
	const base = (extend == null ? void 0 : extend.base) ? cx(extend.base, options == null ? void 0 : options.base) : options == null ? void 0 : options.base;
	const variants = (extend == null ? void 0 : extend.variants) && !isEmptyObject(extend.variants) ? mergeObjects(variantsProps, extend.variants) : variantsProps;
	const defaultVariants = (extend == null ? void 0 : extend.defaultVariants) && !isEmptyObject(extend.defaultVariants) ? {
		...extend.defaultVariants,
		...defaultVariantsProps
	} : defaultVariantsProps;
	synchronizeTwMergeConfig(config);
	const isExtendedSlotsEmpty = !(extend == null ? void 0 : extend.slots) || isEmptyObject(extend.slots);
	const componentBase = hasSlots ? isExtendedSlotsEmpty && (extend == null ? void 0 : extend.base) ? cx(options == null ? void 0 : options.base, extend.base) : typeof (options == null ? void 0 : options.base) === "string" || (options == null ? void 0 : options.base) == null ? options.base : cx(options.base) : void 0;
	const componentSlots = hasSlots ? {
		base: componentBase,
		...slotProps
	} : {};
	const slots = isExtendedSlotsEmpty ? componentSlots : joinObjects({ ...extend == null ? void 0 : extend.slots }, isEmptyObject(componentSlots) ? { base: options == null ? void 0 : options.base } : componentSlots);
	const compoundVariants = !(extend == null ? void 0 : extend.compoundVariants) || isEmptyObject(extend.compoundVariants) ? compoundVariantsProps : flatMergeArrays(extend == null ? void 0 : extend.compoundVariants, compoundVariantsProps);
	const compoundSlots = !(extend == null ? void 0 : extend.compoundSlots) || isEmptyObject(extend.compoundSlots) ? compoundSlotsProps : flatMergeArrays(extend == null ? void 0 : extend.compoundSlots, compoundSlotsProps);
	const variantKeys = Object.keys(variants);
	return {
		config,
		extend,
		base,
		variants,
		defaultVariants,
		slots,
		compoundVariants,
		compoundSlots,
		compiledVariants: null,
		compiledCompoundVariants: null,
		compiledCompoundSlots: null,
		compiledCompoundSlotsBySlot: null,
		deferredError: compoundVariants && !Array.isArray(compoundVariants) ? /* @__PURE__ */ new TypeError(`The "compoundVariants" prop must be an array. Received: ${typeof compoundVariants}`) : compoundSlots && !Array.isArray(compoundSlots) ? /* @__PURE__ */ new TypeError(`The "compoundSlots" prop must be an array. Received: ${typeof compoundSlots}`) : null,
		mode: hasSlots || !isExtendedSlotsEmpty ? "slots" : variantKeys.length === 0 ? "plain" : "variants",
		slotKeys: null,
		variantKeys
	};
};
var compileResolvedOptions = (resolved) => {
	if (resolved.compiledVariants !== null) return resolved;
	resolved.compiledVariants = compileVariants(resolved.variants, resolved.variantKeys);
	resolved.compiledCompoundVariants = compileCompoundVariants(resolved.compoundVariants);
	resolved.compiledCompoundSlots = compileCompoundSlots(resolved.compoundSlots);
	resolved.compiledCompoundSlotsBySlot = indexCompoundSlotsBySlot(resolved.compiledCompoundSlots);
	resolved.slotKeys = resolved.slots && typeof resolved.slots === "object" ? Object.keys(resolved.slots) : [];
	return resolved;
};
var EMPTY_ARRAY = [];
var variantClassesScratch = [];
var compoundClassesScratch = [];
var compoundVariantBySlotScratch = [];
var compoundSlotClassesScratch = [];
var getCompleteProps = (defaultVariants, props, slotProps) => {
	const result = {};
	for (const key in defaultVariants) result[key] = defaultVariants[key];
	if (props) {
		for (const key in props) if (props[key] !== void 0) result[key] = props[key];
	}
	if (slotProps) {
		for (const key in slotProps) if (slotProps[key] !== void 0) result[key] = slotProps[key];
	}
	return result;
};
var isNullishOrFalse = (value) => value == null || value === false;
var matchesCompoundValue = (expected, actual) => {
	if (!Array.isArray(expected)) return expected === actual || isNullishOrFalse(expected) && isNullishOrFalse(actual);
	for (let i = 0; i < expected.length; i++) {
		const expectedValue = expected[i];
		if (expectedValue === actual || isNullishOrFalse(expectedValue) && isNullishOrFalse(actual)) return true;
	}
	return false;
};
var getVariantValue = (variant, defaultVariants, props, slotProps) => {
	if (variant.isEmpty) return null;
	const variantProp = (slotProps == null ? void 0 : slotProps[variant.key]) ?? (props == null ? void 0 : props[variant.key]);
	if (variantProp === null) return null;
	const variantKey = falsyToString(variantProp);
	if (typeof variantKey === "object") return null;
	const defaultVariantProp = defaultVariants == null ? void 0 : defaultVariants[variant.key];
	const key = variantKey != null ? variantKey : falsyToString(defaultVariantProp);
	return variant.values[key || "false"];
};
var matchesConditions = (compound, completeProps) => {
	const { conditionKeys, source } = compound;
	for (let i = 0; i < conditionKeys.length; i++) {
		const key = conditionKeys[i];
		if (!matchesCompoundValue(source[key], completeProps[key])) return false;
	}
	return true;
};
var pushCompoundClassForSlot = (result, slotKey, classValue) => {
	if (typeof classValue === "string") {
		if (slotKey === "base") result.push(classValue);
	} else if (classValue && typeof classValue === "object" && classValue[slotKey]) result.push(classValue[slotKey]);
};
var getVariantClassNames = (variants, defaultVariants, props) => {
	const result = variantClassesScratch;
	result.length = 0;
	for (let i = 0; i < variants.length; i++) {
		const value = getVariantValue(variants[i], defaultVariants, props);
		if (value) result.push(value);
	}
	return result;
};
var getVariantClassNamesBySlot = (slotKey, variants, defaultVariants, props, slotProps) => {
	const result = variantClassesScratch;
	result.length = 0;
	for (let i = 0; i < variants.length; i++) {
		const variantValue = getVariantValue(variants[i], defaultVariants, props, slotProps);
		const value = slotKey === "base" && typeof variantValue === "string" ? variantValue : variantValue && variantValue[slotKey];
		if (value) result.push(value);
	}
	return result;
};
var getCompoundVariantClasses = (compoundVariants, completeProps) => {
	const result = compoundClassesScratch;
	result.length = 0;
	for (let i = 0; i < compoundVariants.length; i++) {
		const compoundVariant = compoundVariants[i];
		if (!matchesConditions(compoundVariant, completeProps)) continue;
		if (compoundVariant.source.class) result.push(compoundVariant.source.class);
		if (compoundVariant.source.className) result.push(compoundVariant.source.className);
	}
	return result;
};
var getCompoundVariantClassesBySlot = (slotKey, compoundVariants, completeProps) => {
	const result = compoundVariantBySlotScratch;
	result.length = 0;
	for (let i = 0; i < compoundVariants.length; i++) {
		const compoundVariant = compoundVariants[i];
		if (!matchesConditions(compoundVariant, completeProps)) continue;
		pushCompoundClassForSlot(result, slotKey, compoundVariant.source.class);
		pushCompoundClassForSlot(result, slotKey, compoundVariant.source.className);
	}
	return result;
};
var getCompoundSlotClasses = (compoundSlotsForKey, completeProps) => {
	const result = compoundSlotClassesScratch;
	result.length = 0;
	for (let i = 0; i < compoundSlotsForKey.length; i++) {
		const compoundSlot = compoundSlotsForKey[i];
		if (!matchesConditions(compoundSlot, completeProps)) continue;
		if (compoundSlot.source.class) result.push(compoundSlot.source.class);
		if (compoundSlot.source.className) result.push(compoundSlot.source.className);
	}
	return result;
};
var createPlainResolver = (resolved, cn) => {
	const { base, config } = resolved;
	let core = CACHE_MISS;
	const mergeOverride = createLazyOverrideMerge(cn, config);
	return ((props) => {
		if (core === CACHE_MISS) core = cn(config, base);
		return mergeOverride(core, props);
	});
};
var createVariantResolver = (resolved, cn) => {
	const { base, config, defaultVariants, deferredError, variantKeys } = resolved;
	let compiledCompoundVariants = resolved.compiledCompoundVariants;
	let compiledVariants = resolved.compiledVariants;
	let compiledCompoundSlots = EMPTY_ARRAY;
	let cache = null;
	const mergeOverride = createLazyOverrideMerge(cn, config);
	let coldInvokesRemaining = 1;
	const computeCore = (props) => {
		const compoundClasses = compiledCompoundVariants.length > 0 ? getCompoundVariantClasses(compiledCompoundVariants, getCompleteProps(defaultVariants, props)) : void 0;
		return cn(config, base, getVariantClassNames(compiledVariants, defaultVariants, props), compoundClasses);
	};
	return ((props) => {
		if (deferredError) throw deferredError;
		if (compiledVariants === null || compiledCompoundVariants === null) {
			compileResolvedOptions(resolved);
			compiledVariants = resolved.compiledVariants;
			compiledCompoundVariants = resolved.compiledCompoundVariants;
			compiledCompoundSlots = resolved.compiledCompoundSlots ?? EMPTY_ARRAY;
		}
		let core;
		if (coldInvokesRemaining > 0) {
			coldInvokesRemaining--;
			core = computeCore(props);
		} else {
			cache ??= createResultCache();
			const propsFingerprint = buildPropsFingerprint(variantKeys, defaultVariants, props);
			if (propsFingerprint !== null) {
				const compoundsSig = compiledCompoundVariants.length > 0 || compiledCompoundSlots.length > 0 ? buildCompoundsSignature(compiledCompoundVariants, compiledCompoundSlots) : "";
				const cacheKey = propsFingerprint + "#" + compoundsSig;
				const cached = cache.get(cacheKey);
				if (cached !== CACHE_MISS) core = cached;
				else {
					core = computeCore(props);
					cache.set(cacheKey, core);
				}
			} else core = computeCore(props);
		}
		return mergeOverride(core, props);
	});
};
var createSlotsResolver = (resolved, cn) => {
	const { config, defaultVariants, deferredError, slots, variantKeys } = resolved;
	let compoundVariants = null;
	let compoundSlots = null;
	let keys = null;
	let slotComputers = null;
	let hasCompounds = false;
	let mergeOverride = null;
	let parentCache = null;
	let coldParentInvokesRemaining = 1;
	const ensureCompiled = () => {
		if (keys !== null) return;
		if (resolved.compiledVariants === null || resolved.compiledCompoundVariants === null || resolved.compiledCompoundSlots === null || resolved.compiledCompoundSlotsBySlot === null || resolved.slotKeys === null) compileResolvedOptions(resolved);
		const variants = resolved.compiledVariants;
		compoundVariants = resolved.compiledCompoundVariants;
		compoundSlots = resolved.compiledCompoundSlots;
		const compoundSlotsBySlot = resolved.compiledCompoundSlotsBySlot;
		keys = resolved.slotKeys;
		hasCompounds = compoundVariants.length > 0 || compoundSlots.length > 0;
		mergeOverride = createLazyOverrideMerge(cn, config);
		const computers = new Array(keys.length);
		for (let i = 0; i < keys.length; i++) {
			const slotKey = keys[i];
			const compoundSlotsForKey = compoundSlotsBySlot[slotKey] ?? EMPTY_ARRAY;
			computers[i] = (propsRef, slotProps) => {
				const completeProps = hasCompounds ? getCompleteProps(defaultVariants, propsRef, slotProps) : void 0;
				const compoundVariantClasses = completeProps ? getCompoundVariantClassesBySlot(slotKey, compoundVariants, completeProps) : void 0;
				const compoundSlotClasses = completeProps ? getCompoundSlotClasses(compoundSlotsForKey, completeProps) : void 0;
				return cn(config, slots[slotKey], getVariantClassNamesBySlot(slotKey, variants, defaultVariants, propsRef, slotProps), compoundVariantClasses, compoundSlotClasses);
			};
		}
		slotComputers = computers;
	};
	const createSlotsResult = (props) => {
		const slotKeys = keys;
		const computers = slotComputers;
		const overrideMerge = mergeOverride;
		const result = {};
		for (let i = 0; i < slotKeys.length; i++) {
			const compute = computers[i];
			const core = compute(props);
			result[slotKeys[i]] = (slotProps) => {
				if (slotProps == null) return core;
				let hasVariantOverride = false;
				for (const key in slotProps) {
					if (key === "class" || key === "className") continue;
					if (slotProps[key] !== void 0) {
						hasVariantOverride = true;
						break;
					}
				}
				if (!hasVariantOverride) return overrideMerge(core, slotProps);
				return overrideMerge(compute(props, slotProps), slotProps);
			};
		}
		return result;
	};
	return ((props) => {
		if (deferredError) throw deferredError;
		ensureCompiled();
		if (coldParentInvokesRemaining > 0) {
			coldParentInvokesRemaining--;
			return createSlotsResult(props);
		}
		const propsFingerprint = buildPropsFingerprint(variantKeys, defaultVariants, props);
		if (propsFingerprint === null) return createSlotsResult(props);
		const compoundsSig = hasCompounds ? buildCompoundsSignature(compoundVariants, compoundSlots) : "";
		const cacheKey = propsFingerprint + "#" + compoundsSig;
		parentCache ??= createBoundedCache();
		const cached = parentCache.get(cacheKey);
		if (cached !== CACHE_MISS) return cached;
		const next = createSlotsResult(props);
		parentCache.set(cacheKey, next);
		return next;
	});
};
var createClassResolver = (resolved, cn) => {
	if (resolved.mode === "plain") return createPlainResolver(resolved, cn);
	let resolver;
	return ((props) => {
		resolver ??= resolved.mode === "slots" ? createSlotsResolver(resolved, cn) : createVariantResolver(resolved, cn);
		return resolver(props);
	});
};
var attachComponentMetadata = (component, resolved) => {
	component.variantKeys = resolved.variantKeys;
	component.extend = resolved.extend;
	component.base = resolved.base;
	component.slots = resolved.slots;
	component.variants = resolved.variants;
	component.defaultVariants = resolved.defaultVariants;
	component.compoundSlots = resolved.compoundSlots;
	component.compoundVariants = resolved.compoundVariants;
};
var getTailwindVariants = (cn) => {
	const tv = (options, configProp) => {
		const resolved = resolveOptions(options, configProp);
		const component = createClassResolver(resolved, cn);
		attachComponentMetadata(component, resolved);
		return component;
	};
	const createTV = (configProp) => {
		return (options, config) => tv(options, config ? mergeObjects(configProp, config) : configProp);
	};
	return {
		tv,
		createTV
	};
};
//#endregion
//#region node_modules/.pnpm/tailwind-variants@3.3.1_tailwind-merge@3.7.0_tailwindcss@4.3.3/node_modules/tailwind-variants/dist/index.js
var concatArrays = (array1, array2) => {
	const length1 = array1.length;
	const length2 = array2.length;
	const combined = new Array(length1 + length2);
	for (let i = 0; i < length1; i++) combined[i] = array1[i];
	for (let i = 0; i < length2; i++) combined[length1 + i] = array2[i];
	return combined;
};
var createClassValidatorObject = (classGroupId, validator) => ({
	classGroupId,
	validator
});
var createClassPartObject = (nextPart = /* @__PURE__ */ new Map(), validators = null, classGroupId) => ({
	nextPart,
	validators,
	classGroupId
});
var CLASS_PART_SEPARATOR = "-";
var EMPTY_CONFLICTS = [];
var ARBITRARY_PROPERTY_PREFIX = "arbitrary..";
var createClassGroupUtils = (config) => {
	const classMap = createClassMap(config);
	const { conflictingClassGroups, conflictingClassGroupModifiers } = config;
	const getClassGroupId = (className) => {
		if (className[0] === "[" && className[className.length - 1] === "]") return getGroupIdForArbitraryProperty(className);
		const classParts = className.split(CLASS_PART_SEPARATOR);
		return getGroupRecursive(classParts, classParts[0] === "" && classParts.length > 1 ? 1 : 0, classMap);
	};
	const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
		if (hasPostfixModifier) {
			const modifierConflicts = conflictingClassGroupModifiers[classGroupId];
			const baseConflicts = conflictingClassGroups[classGroupId];
			if (modifierConflicts) {
				if (baseConflicts) return concatArrays(baseConflicts, modifierConflicts);
				return modifierConflicts;
			}
			return baseConflicts || EMPTY_CONFLICTS;
		}
		return conflictingClassGroups[classGroupId] || EMPTY_CONFLICTS;
	};
	return {
		getClassGroupId,
		getConflictingClassGroupIds
	};
};
var getGroupRecursive = (classParts, startIndex, classPartObject) => {
	if (classParts.length - startIndex === 0) return classPartObject.classGroupId;
	const currentClassPart = classParts[startIndex];
	const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
	if (nextClassPartObject) {
		const result = getGroupRecursive(classParts, startIndex + 1, nextClassPartObject);
		if (result) return result;
	}
	const validators = classPartObject.validators;
	if (validators === null) return;
	const classRest = startIndex === 0 ? classParts.join(CLASS_PART_SEPARATOR) : classParts.slice(startIndex).join(CLASS_PART_SEPARATOR);
	const validatorsLength = validators.length;
	for (let index = 0; index < validatorsLength; index++) {
		const validatorObject = validators[index];
		if (validatorObject.validator(classRest)) return validatorObject.classGroupId;
	}
};
var getGroupIdForArbitraryProperty = (className) => {
	const content = className.slice(1, -1);
	const colonIndex = content.indexOf(":");
	if (colonIndex === -1) return;
	const property = content.slice(0, colonIndex);
	return property ? ARBITRARY_PROPERTY_PREFIX + property : void 0;
};
var createClassMap = (config) => {
	const { theme, classGroups } = config;
	return processClassGroups(classGroups, theme);
};
var processClassGroups = (classGroups, theme) => {
	const classMap = createClassPartObject();
	for (const classGroupId in classGroups) {
		const group = classGroups[classGroupId];
		processClassesRecursively(group, classMap, classGroupId, theme);
	}
	return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
	const length = classGroup.length;
	for (let index = 0; index < length; index++) {
		const classDefinition = classGroup[index];
		processClassDefinition(classDefinition, classPartObject, classGroupId, theme);
	}
};
var processClassDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (typeof classDefinition === "string") {
		processStringDefinition(classDefinition, classPartObject, classGroupId);
		return;
	}
	if (typeof classDefinition === "function") {
		processFunctionDefinition(classDefinition, classPartObject, classGroupId, theme);
		return;
	}
	processObjectDefinition(classDefinition, classPartObject, classGroupId, theme);
};
var processStringDefinition = (classDefinition, classPartObject, classGroupId) => {
	const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
	classPartObjectToEdit.classGroupId = classGroupId;
};
var processFunctionDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	if (isThemeGetter(classDefinition)) {
		processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
		return;
	}
	if (classPartObject.validators === null) classPartObject.validators = [];
	classPartObject.validators.push(createClassValidatorObject(classGroupId, classDefinition));
};
var processObjectDefinition = (classDefinition, classPartObject, classGroupId, theme) => {
	const entries = Object.entries(classDefinition);
	const length = entries.length;
	for (let index = 0; index < length; index++) {
		const [key, value] = entries[index];
		processClassesRecursively(value, getPart(classPartObject, key), classGroupId, theme);
	}
};
var getPart = (classPartObject, path) => {
	let current = classPartObject;
	const parts = path.split(CLASS_PART_SEPARATOR);
	const length = parts.length;
	for (let index = 0; index < length; index++) {
		const part = parts[index];
		let next = current.nextPart.get(part);
		if (!next) {
			next = createClassPartObject();
			current.nextPart.set(part, next);
		}
		current = next;
	}
	return current;
};
var isThemeGetter = (classDefinition) => "isThemeGetter" in classDefinition && classDefinition.isThemeGetter === true;
var IMPORTANT_MODIFIER = "!";
var CHAR_MODIFIER_SEPARATOR = 58;
var CHAR_POSTFIX_SEPARATOR = 47;
var CHAR_OPEN_BRACKET = 91;
var CHAR_CLOSE_BRACKET = 93;
var CHAR_OPEN_PAREN = 40;
var CHAR_CLOSE_PAREN = 41;
var CHAR_IMPORTANT = 33;
var createResultObject = (modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition) => ({
	modifiers,
	hasImportantModifier,
	baseClassName,
	maybePostfixModifierPosition,
	isExternal: void 0
});
var parseClassName = (className) => {
	const modifiers = [];
	let bracketDepth = 0;
	let parenDepth = 0;
	let modifierStart = 0;
	let postfixModifierPosition;
	const len = className.length;
	for (let index = 0; index < len; index++) {
		const charCode = className.charCodeAt(index);
		if (bracketDepth === 0 && parenDepth === 0) {
			if (charCode === CHAR_MODIFIER_SEPARATOR) {
				modifiers.push(className.slice(modifierStart, index));
				modifierStart = index + 1;
				continue;
			}
			if (charCode === CHAR_POSTFIX_SEPARATOR) {
				postfixModifierPosition = index;
				continue;
			}
		}
		if (charCode === CHAR_OPEN_BRACKET) bracketDepth++;
		else if (charCode === CHAR_CLOSE_BRACKET) bracketDepth--;
		else if (charCode === CHAR_OPEN_PAREN) parenDepth++;
		else if (charCode === CHAR_CLOSE_PAREN) parenDepth--;
	}
	const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.slice(modifierStart);
	let baseClassName = baseClassNameWithImportantModifier;
	let hasImportantModifier = false;
	const lastIndex = baseClassNameWithImportantModifier.length - 1;
	if (baseClassNameWithImportantModifier.charCodeAt(lastIndex) === CHAR_IMPORTANT) {
		baseClassName = baseClassNameWithImportantModifier.slice(0, -1);
		hasImportantModifier = true;
	} else if (baseClassNameWithImportantModifier.charCodeAt(0) === CHAR_IMPORTANT) {
		baseClassName = baseClassNameWithImportantModifier.slice(1);
		hasImportantModifier = true;
	}
	const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
	return createResultObject(modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition);
};
var createSortModifiers = (config) => {
	const orderSensitiveModifiers = new Set(config.orderSensitiveModifiers);
	return (modifiers) => {
		const result = [];
		let currentSegment = [];
		for (let index = 0; index < modifiers.length; index++) {
			const modifier = modifiers[index];
			const isArbitrary = modifier[0] === "[";
			const isOrderSensitive = orderSensitiveModifiers.has(modifier);
			if (isArbitrary || isOrderSensitive) {
				if (currentSegment.length > 0) {
					currentSegment.sort();
					for (let segmentIndex = 0; segmentIndex < currentSegment.length; segmentIndex++) result.push(currentSegment[segmentIndex]);
					currentSegment = [];
				}
				result.push(modifier);
			} else currentSegment.push(modifier);
		}
		if (currentSegment.length > 0) {
			currentSegment.sort();
			for (let segmentIndex = 0; segmentIndex < currentSegment.length; segmentIndex++) result.push(currentSegment[segmentIndex]);
		}
		return result;
	};
};
var EXTERNAL_DESCRIPTOR = {
	isExternal: true,
	classId: -1,
	conflictIds: []
};
var DESCRIPTOR_CACHE_SIZE = 4096;
var MAX_CONFLICT_KEYS = 16384;
var createConfigUtils = (config) => {
	const sortModifiers = createSortModifiers(config);
	const postfixLookupClassGroupIds = createPostfixLookupClassGroupIds(config);
	const { getClassGroupId, getConflictingClassGroupIds } = createClassGroupUtils(config);
	let descriptorCache = /* @__PURE__ */ Object.create(null);
	let previousDescriptorCache = /* @__PURE__ */ Object.create(null);
	let descriptorCacheSize = 0;
	let claimedGeneration = /* @__PURE__ */ new Int32Array(256);
	let currentGeneration = 0;
	let keepFlags = /* @__PURE__ */ new Uint8Array(64);
	let splitSawNonSpaceWhitespace = false;
	const splitClassList = (classList) => {
		const tokens = [];
		const length = classList.length;
		let tokenStart = -1;
		splitSawNonSpaceWhitespace = false;
		for (let index = 0; index < length; index++) {
			const charCode = classList.charCodeAt(index);
			if (charCode === 32) {
				if (tokenStart !== -1) {
					tokens.push(classList.slice(tokenStart, index));
					tokenStart = -1;
				}
			} else if (charCode >= 9 && charCode <= 13) {
				splitSawNonSpaceWhitespace = true;
				if (tokenStart !== -1) {
					tokens.push(classList.slice(tokenStart, index));
					tokenStart = -1;
				}
			} else if (tokenStart === -1) tokenStart = index;
		}
		if (tokenStart !== -1) tokens.push(classList.slice(tokenStart));
		return tokens;
	};
	const conflictKeyIds = /* @__PURE__ */ new Map();
	let nextConflictKeyId = 0;
	const internConflictKey = (conflictKey) => {
		let id = conflictKeyIds.get(conflictKey);
		if (id === void 0) {
			id = nextConflictKeyId++;
			conflictKeyIds.set(conflictKey, id);
			if (id >= claimedGeneration.length) {
				const grown = new Int32Array(claimedGeneration.length * 2);
				grown.set(claimedGeneration);
				claimedGeneration = grown;
			}
		}
		return id;
	};
	const computeClassDescriptor = (originalClassName) => {
		const { isExternal, modifiers, hasImportantModifier, baseClassName, maybePostfixModifierPosition } = parseClassName(originalClassName);
		if (isExternal) return EXTERNAL_DESCRIPTOR;
		let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
		let classGroupId;
		if (hasPostfixModifier) {
			const baseClassNameWithoutPostfix = baseClassName.substring(0, maybePostfixModifierPosition);
			classGroupId = getClassGroupId(baseClassNameWithoutPostfix);
			const classGroupIdWithPostfix = classGroupId && postfixLookupClassGroupIds[classGroupId] ? getClassGroupId(baseClassName) : void 0;
			if (classGroupIdWithPostfix && classGroupIdWithPostfix !== classGroupId) {
				classGroupId = classGroupIdWithPostfix;
				hasPostfixModifier = false;
			}
		} else classGroupId = getClassGroupId(baseClassName);
		if (!classGroupId) {
			if (!hasPostfixModifier) return EXTERNAL_DESCRIPTOR;
			classGroupId = getClassGroupId(baseClassName);
			if (!classGroupId) return EXTERNAL_DESCRIPTOR;
			hasPostfixModifier = false;
		}
		const variantModifier = modifiers.length === 0 ? "" : modifiers.length === 1 ? modifiers[0] : sortModifiers(modifiers).join(":");
		const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
		const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
		const conflictIds = [];
		for (let index = 0; index < conflictGroups.length; index++) conflictIds.push(internConflictKey(modifierId + conflictGroups[index]));
		return {
			isExternal: false,
			classId: internConflictKey(modifierId + classGroupId),
			conflictIds
		};
	};
	const getClassDescriptor = (originalClassName) => {
		let descriptor = descriptorCache[originalClassName];
		if (descriptor !== void 0) return descriptor;
		descriptor = previousDescriptorCache[originalClassName];
		if (descriptor === void 0) descriptor = computeClassDescriptor(originalClassName);
		descriptorCache[originalClassName] = descriptor;
		if (++descriptorCacheSize > DESCRIPTOR_CACHE_SIZE) {
			descriptorCacheSize = 0;
			previousDescriptorCache = descriptorCache;
			descriptorCache = /* @__PURE__ */ Object.create(null);
		}
		return descriptor;
	};
	const mergeClassList = (classList) => {
		const classNames = splitClassList(classList);
		const classCount = classNames.length;
		if (classCount === 1) return classNames[0];
		if (nextConflictKeyId > MAX_CONFLICT_KEYS) {
			conflictKeyIds.clear();
			nextConflictKeyId = 0;
			descriptorCache = /* @__PURE__ */ Object.create(null);
			previousDescriptorCache = /* @__PURE__ */ Object.create(null);
			descriptorCacheSize = 0;
		}
		currentGeneration = currentGeneration + 1 | 0;
		if (currentGeneration === 0) currentGeneration = 1;
		const generation = currentGeneration;
		if (classCount > keepFlags.length) {
			let capacity = keepFlags.length;
			while (capacity < classCount) capacity *= 2;
			keepFlags = new Uint8Array(capacity);
		}
		let didDrop = false;
		let tokenCharCount = 0;
		for (let index = classCount - 1; index >= 0; index -= 1) {
			const className = classNames[index];
			tokenCharCount += className.length;
			const descriptor = getClassDescriptor(className);
			if (descriptor.isExternal) {
				keepFlags[index] = 1;
				continue;
			}
			const classId = descriptor.classId;
			if (claimedGeneration[classId] === generation) {
				keepFlags[index] = 0;
				didDrop = true;
				continue;
			}
			claimedGeneration[classId] = generation;
			const conflictIds = descriptor.conflictIds;
			for (let conflictIndex = 0; conflictIndex < conflictIds.length; conflictIndex++) claimedGeneration[conflictIds[conflictIndex]] = generation;
			keepFlags[index] = 1;
		}
		if (!didDrop && !splitSawNonSpaceWhitespace && classList.length === tokenCharCount + classCount - 1) return classList;
		let result = "";
		for (let index = 0; index < classCount; index++) if (keepFlags[index] === 1) {
			if (result) result += " ";
			result += classNames[index];
		}
		return result;
	};
	return {
		parseClassName,
		sortModifiers,
		postfixLookupClassGroupIds,
		getClassGroupId,
		getConflictingClassGroupIds,
		getClassDescriptor,
		mergeClassList
	};
};
var createPostfixLookupClassGroupIds = (config) => {
	const lookup = /* @__PURE__ */ Object.create(null);
	const classGroupIds = config.postfixLookupClassGroups;
	if (classGroupIds) for (let index = 0; index < classGroupIds.length; index++) lookup[classGroupIds[index]] = true;
	return lookup;
};
var MERGE_CACHE_SIZE = 500;
var createTailwindMerge = (createConfig) => {
	let configUtils;
	let mergeClassList;
	let cache = /* @__PURE__ */ Object.create(null);
	let previousCache = /* @__PURE__ */ Object.create(null);
	let cacheSize = 0;
	const initTailwindMerge = (classList) => {
		configUtils = createConfigUtils(createConfig());
		mergeClassList = configUtils.mergeClassList;
		merge.mergeString = tailwindMerge;
		return tailwindMerge(classList);
	};
	const tailwindMerge = (classList) => {
		let result = cache[classList];
		if (result !== void 0) return result;
		result = previousCache[classList];
		if (result === void 0) result = mergeClassList(classList);
		cache[classList] = result;
		if (++cacheSize > MERGE_CACHE_SIZE) {
			cacheSize = 0;
			previousCache = cache;
			cache = /* @__PURE__ */ Object.create(null);
		}
		return result;
	};
	const merge = (...args) => merge.mergeString(joinClassValue(args));
	merge.mergeString = initTailwindMerge;
	return merge;
};
var fallbackThemeArr = [];
var fromTheme = (key) => {
	const themeGetter = (theme) => theme[key] || fallbackThemeArr;
	themeGetter.isThemeGetter = true;
	return themeGetter;
};
var arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
var arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
var fractionRegex = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/;
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var toNumber = Number;
var numberIsNaN = Number.isNaN;
var numberIsInteger = Number.isInteger;
var isFraction = (value) => fractionRegex.test(value);
var isNumber = (value) => Boolean(value) && !numberIsNaN(toNumber(value));
var isInteger = (value) => Boolean(value) && numberIsInteger(toNumber(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var isAny = () => true;
var isLengthOnly = (value) => lengthUnitRegex.test(value) && !colorFunctionRegex.test(value);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
var isNamedContainerQuery = (value) => value.startsWith("@container") && (value[10] === "/" && value[11] !== void 0 || value[11] === "s" && value[16] !== void 0 && value.startsWith("-size/", 10) || value[11] === "n" && value[18] !== void 0 && value.startsWith("-normal/", 10));
var isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
var isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
var isArbitraryWeight = (value) => getIsArbitraryValue(value, isLabelWeight, isAny);
var isArbitraryFamilyName = (value) => getIsArbitraryValue(value, isLabelFamilyName, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
var isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
var isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
var isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
var isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
var isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
var isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
var isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
var isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
var isArbitraryVariableWeight = (value) => getIsArbitraryVariable(value, isLabelWeight, true);
var getIsArbitraryValue = (value, testLabel, testValue) => {
	const result = arbitraryValueRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return testValue(result[2]);
	}
	return false;
};
var getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
	const result = arbitraryVariableRegex.exec(value);
	if (result) {
		if (result[1]) return testLabel(result[1]);
		return shouldMatchNoLabel;
	}
	return false;
};
var isLabelPosition = (label) => label === "position" || label === "percentage";
var isLabelImage = (label) => label === "image" || label === "url";
var isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
var isLabelLength = (label) => label === "length";
var isLabelNumber = (label) => label === "number";
var isLabelFamilyName = (label) => label === "family-name";
var isLabelWeight = (label) => label === "number" || label === "weight";
var isLabelShadow = (label) => label === "shadow";
var getDefaultConfig = () => {
	const themeColor = fromTheme("color");
	const themeFont = fromTheme("font");
	const themeText = fromTheme("text");
	const themeFontWeight = fromTheme("font-weight");
	const themeTracking = fromTheme("tracking");
	const themeLeading = fromTheme("leading");
	const themeBreakpoint = fromTheme("breakpoint");
	const themeContainer = fromTheme("container");
	const themeSpacing = fromTheme("spacing");
	const themeRadius = fromTheme("radius");
	const themeShadow = fromTheme("shadow");
	const themeInsetShadow = fromTheme("inset-shadow");
	const themeTextShadow = fromTheme("text-shadow");
	const themeDropShadow = fromTheme("drop-shadow");
	const themeBlur = fromTheme("blur");
	const themePerspective = fromTheme("perspective");
	const themeAspect = fromTheme("aspect");
	const themeEase = fromTheme("ease");
	const themeAnimate = fromTheme("animate");
	const scaleBreak = () => [
		"auto",
		"avoid",
		"all",
		"avoid-page",
		"page",
		"left",
		"right",
		"column"
	];
	const scalePosition = () => [
		"center",
		"top",
		"bottom",
		"left",
		"right",
		"top-left",
		"left-top",
		"top-right",
		"right-top",
		"bottom-right",
		"right-bottom",
		"bottom-left",
		"left-bottom"
	];
	const scalePositionWithArbitrary = () => [
		...scalePosition(),
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleOverflow = () => [
		"auto",
		"hidden",
		"clip",
		"visible",
		"scroll"
	];
	const scaleOverscroll = () => [
		"auto",
		"contain",
		"none"
	];
	const scaleUnambiguousSpacing = () => [
		isArbitraryVariable,
		isArbitraryValue,
		themeSpacing
	];
	const scaleInset = () => [
		isFraction,
		"full",
		"auto",
		...scaleUnambiguousSpacing()
	];
	const scaleGridTemplateColsRows = () => [
		isInteger,
		"none",
		"subgrid",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartAndEnd = () => [
		"auto",
		{ span: [
			"full",
			isInteger,
			isArbitraryVariable,
			isArbitraryValue
		] },
		isInteger,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridColRowStartOrEnd = () => [
		isInteger,
		"auto",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleGridAutoColsRows = () => [
		"auto",
		"min",
		"max",
		"fr",
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleAlignPrimaryAxis = () => [
		"start",
		"end",
		"center",
		"between",
		"around",
		"evenly",
		"stretch",
		"baseline",
		"center-safe",
		"end-safe"
	];
	const scaleAlignSecondaryAxis = () => [
		"start",
		"end",
		"center",
		"stretch",
		"center-safe",
		"end-safe"
	];
	const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
	const scaleSizing = () => [
		isFraction,
		"auto",
		"full",
		"dvw",
		"dvh",
		"lvw",
		"lvh",
		"svw",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingInline = () => [
		isFraction,
		"screen",
		"full",
		"dvw",
		"lvw",
		"svw",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleSizingBlock = () => [
		isFraction,
		"screen",
		"full",
		"lh",
		"dvh",
		"lvh",
		"svh",
		"min",
		"max",
		"fit",
		...scaleUnambiguousSpacing()
	];
	const scaleColor = () => [
		themeColor,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBgPosition = () => [
		...scalePosition(),
		isArbitraryVariablePosition,
		isArbitraryPosition,
		{ position: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleBgRepeat = () => ["no-repeat", { repeat: [
		"",
		"x",
		"y",
		"space",
		"round"
	] }];
	const scaleBgSize = () => [
		"auto",
		"cover",
		"contain",
		isArbitraryVariableSize,
		isArbitrarySize,
		{ size: [isArbitraryVariable, isArbitraryValue] }
	];
	const scaleGradientStopPosition = () => [
		isPercent,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleRadius = () => [
		"",
		"none",
		"full",
		themeRadius,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleBorderWidth = () => [
		"",
		isNumber,
		isArbitraryVariableLength,
		isArbitraryLength
	];
	const scaleLineStyle = () => [
		"solid",
		"dashed",
		"dotted",
		"double"
	];
	const scaleBlendMode = () => [
		"normal",
		"multiply",
		"screen",
		"overlay",
		"darken",
		"lighten",
		"color-dodge",
		"color-burn",
		"hard-light",
		"soft-light",
		"difference",
		"exclusion",
		"hue",
		"saturation",
		"color",
		"luminosity"
	];
	const scaleMaskImagePosition = () => [
		isNumber,
		isPercent,
		isArbitraryVariablePosition,
		isArbitraryPosition
	];
	const scaleBlur = () => [
		"",
		"none",
		themeBlur,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleRotate = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleScale = () => [
		"none",
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleSkew = () => [
		isNumber,
		isArbitraryVariable,
		isArbitraryValue
	];
	const scaleTranslate = () => [
		isFraction,
		"full",
		...scaleUnambiguousSpacing()
	];
	return {
		theme: {
			animate: [
				"spin",
				"ping",
				"pulse",
				"bounce"
			],
			aspect: ["video"],
			blur: [isTshirtSize],
			breakpoint: [isTshirtSize],
			color: [isAny],
			container: [isTshirtSize],
			"drop-shadow": [isTshirtSize],
			ease: [
				"in",
				"out",
				"in-out"
			],
			font: [isAnyNonArbitrary],
			"font-weight": [
				"thin",
				"extralight",
				"light",
				"normal",
				"medium",
				"semibold",
				"bold",
				"extrabold",
				"black"
			],
			"inset-shadow": [isTshirtSize],
			leading: [
				"none",
				"tight",
				"snug",
				"normal",
				"relaxed",
				"loose"
			],
			perspective: [
				"dramatic",
				"near",
				"normal",
				"midrange",
				"distant",
				"none"
			],
			radius: [isTshirtSize],
			shadow: [isTshirtSize],
			spacing: ["px", isNumber],
			text: [isTshirtSize],
			"text-shadow": [isTshirtSize],
			tracking: [
				"tighter",
				"tight",
				"normal",
				"wide",
				"wider",
				"widest"
			]
		},
		classGroups: {
			/**
			* Aspect Ratio
			* @see https://tailwindcss.com/docs/aspect-ratio
			*/
			aspect: [{ aspect: [
				"auto",
				"square",
				isFraction,
				isArbitraryValue,
				isArbitraryVariable,
				themeAspect
			] }],
			/**
			* Container
			* @see https://tailwindcss.com/docs/container
			* @deprecated since Tailwind CSS v4.0.0
			*/
			container: ["container"],
			/**
			* Container Type
			* @see https://tailwindcss.com/docs/responsive-design#container-queries
			*/
			"container-type": [{ "@container": [
				"",
				"normal",
				"size",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Container Name
			* @see https://tailwindcss.com/docs/responsive-design#named-containers
			*/
			"container-named": [isNamedContainerQuery],
			/**
			* Columns
			* @see https://tailwindcss.com/docs/columns
			*/
			columns: [{ columns: [
				isNumber,
				isArbitraryValue,
				isArbitraryVariable,
				themeContainer
			] }],
			/**
			* Break After
			* @see https://tailwindcss.com/docs/break-after
			*/
			"break-after": [{ "break-after": scaleBreak() }],
			/**
			* Break Before
			* @see https://tailwindcss.com/docs/break-before
			*/
			"break-before": [{ "break-before": scaleBreak() }],
			/**
			* Break Inside
			* @see https://tailwindcss.com/docs/break-inside
			*/
			"break-inside": [{ "break-inside": [
				"auto",
				"avoid",
				"avoid-page",
				"avoid-column"
			] }],
			/**
			* Box Decoration Break
			* @see https://tailwindcss.com/docs/box-decoration-break
			*/
			"box-decoration": [{ "box-decoration": ["slice", "clone"] }],
			/**
			* Box Sizing
			* @see https://tailwindcss.com/docs/box-sizing
			*/
			box: [{ box: ["border", "content"] }],
			/**
			* Display
			* @see https://tailwindcss.com/docs/display
			*/
			display: [
				"block",
				"inline-block",
				"inline",
				"flex",
				"inline-flex",
				"table",
				"inline-table",
				"table-caption",
				"table-cell",
				"table-column",
				"table-column-group",
				"table-footer-group",
				"table-header-group",
				"table-row-group",
				"table-row",
				"flow-root",
				"grid",
				"inline-grid",
				"contents",
				"list-item",
				"hidden"
			],
			/**
			* Screen Reader Only
			* @see https://tailwindcss.com/docs/display#screen-reader-only
			*/
			sr: ["sr-only", "not-sr-only"],
			/**
			* Floats
			* @see https://tailwindcss.com/docs/float
			*/
			float: [{ float: [
				"right",
				"left",
				"none",
				"start",
				"end"
			] }],
			/**
			* Clear
			* @see https://tailwindcss.com/docs/clear
			*/
			clear: [{ clear: [
				"left",
				"right",
				"both",
				"none",
				"start",
				"end"
			] }],
			/**
			* Isolation
			* @see https://tailwindcss.com/docs/isolation
			*/
			isolation: ["isolate", "isolation-auto"],
			/**
			* Object Fit
			* @see https://tailwindcss.com/docs/object-fit
			*/
			"object-fit": [{ object: [
				"contain",
				"cover",
				"fill",
				"none",
				"scale-down"
			] }],
			/**
			* Object Position
			* @see https://tailwindcss.com/docs/object-position
			*/
			"object-position": [{ object: scalePositionWithArbitrary() }],
			/**
			* Overflow
			* @see https://tailwindcss.com/docs/overflow
			*/
			overflow: [{ overflow: scaleOverflow() }],
			/**
			* Overflow X
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-x": [{ "overflow-x": scaleOverflow() }],
			/**
			* Overflow Y
			* @see https://tailwindcss.com/docs/overflow
			*/
			"overflow-y": [{ "overflow-y": scaleOverflow() }],
			/**
			* Overscroll Behavior
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			overscroll: [{ overscroll: scaleOverscroll() }],
			/**
			* Overscroll Behavior X
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-x": [{ "overscroll-x": scaleOverscroll() }],
			/**
			* Overscroll Behavior Y
			* @see https://tailwindcss.com/docs/overscroll-behavior
			*/
			"overscroll-y": [{ "overscroll-y": scaleOverscroll() }],
			/**
			* Position
			* @see https://tailwindcss.com/docs/position
			*/
			position: [
				"static",
				"fixed",
				"absolute",
				"relative",
				"sticky"
			],
			/**
			* Inset
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			inset: [{ inset: scaleInset() }],
			/**
			* Inset Inline
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-x": [{ "inset-x": scaleInset() }],
			/**
			* Inset Block
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-y": [{ "inset-y": scaleInset() }],
			/**
			* Inset Inline Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-s` in next major release
			*/
			start: [{
				"inset-s": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				start: scaleInset()
			}],
			/**
			* Inset Inline End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			* @todo class group will be renamed to `inset-e` in next major release
			*/
			end: [{
				"inset-e": scaleInset(),
				/**
				* @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
				* @see https://github.com/tailwindlabs/tailwindcss/pull/19613
				*/
				end: scaleInset()
			}],
			/**
			* Inset Block Start
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-bs": [{ "inset-bs": scaleInset() }],
			/**
			* Inset Block End
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			"inset-be": [{ "inset-be": scaleInset() }],
			/**
			* Top
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			top: [{ top: scaleInset() }],
			/**
			* Right
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			right: [{ right: scaleInset() }],
			/**
			* Bottom
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			bottom: [{ bottom: scaleInset() }],
			/**
			* Left
			* @see https://tailwindcss.com/docs/top-right-bottom-left
			*/
			left: [{ left: scaleInset() }],
			/**
			* Visibility
			* @see https://tailwindcss.com/docs/visibility
			*/
			visibility: [
				"visible",
				"invisible",
				"collapse"
			],
			/**
			* Z-Index
			* @see https://tailwindcss.com/docs/z-index
			*/
			z: [{ z: [
				isInteger,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Basis
			* @see https://tailwindcss.com/docs/flex-basis
			*/
			basis: [{ basis: [
				isFraction,
				"full",
				"auto",
				themeContainer,
				...scaleUnambiguousSpacing()
			] }],
			/**
			* Flex Direction
			* @see https://tailwindcss.com/docs/flex-direction
			*/
			"flex-direction": [{ flex: [
				"row",
				"row-reverse",
				"col",
				"col-reverse"
			] }],
			/**
			* Flex Wrap
			* @see https://tailwindcss.com/docs/flex-wrap
			*/
			"flex-wrap": [{ flex: [
				"nowrap",
				"wrap",
				"wrap-reverse"
			] }],
			/**
			* Flex
			* @see https://tailwindcss.com/docs/flex
			*/
			flex: [{ flex: [
				isNumber,
				isFraction,
				"auto",
				"initial",
				"none",
				isArbitraryValue
			] }],
			/**
			* Flex Grow
			* @see https://tailwindcss.com/docs/flex-grow
			*/
			grow: [{ grow: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Flex Shrink
			* @see https://tailwindcss.com/docs/flex-shrink
			*/
			shrink: [{ shrink: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Order
			* @see https://tailwindcss.com/docs/order
			*/
			order: [{ order: [
				isInteger,
				"first",
				"last",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Grid Template Columns
			* @see https://tailwindcss.com/docs/grid-template-columns
			*/
			"grid-cols": [{ "grid-cols": scaleGridTemplateColsRows() }],
			/**
			* Grid Column Start / End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start-end": [{ col: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Column Start
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-start": [{ "col-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Column End
			* @see https://tailwindcss.com/docs/grid-column
			*/
			"col-end": [{ "col-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Template Rows
			* @see https://tailwindcss.com/docs/grid-template-rows
			*/
			"grid-rows": [{ "grid-rows": scaleGridTemplateColsRows() }],
			/**
			* Grid Row Start / End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start-end": [{ row: scaleGridColRowStartAndEnd() }],
			/**
			* Grid Row Start
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-start": [{ "row-start": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Row End
			* @see https://tailwindcss.com/docs/grid-row
			*/
			"row-end": [{ "row-end": scaleGridColRowStartOrEnd() }],
			/**
			* Grid Auto Flow
			* @see https://tailwindcss.com/docs/grid-auto-flow
			*/
			"grid-flow": [{ "grid-flow": [
				"row",
				"col",
				"dense",
				"row-dense",
				"col-dense"
			] }],
			/**
			* Grid Auto Columns
			* @see https://tailwindcss.com/docs/grid-auto-columns
			*/
			"auto-cols": [{ "auto-cols": scaleGridAutoColsRows() }],
			/**
			* Grid Auto Rows
			* @see https://tailwindcss.com/docs/grid-auto-rows
			*/
			"auto-rows": [{ "auto-rows": scaleGridAutoColsRows() }],
			/**
			* Gap
			* @see https://tailwindcss.com/docs/gap
			*/
			gap: [{ gap: scaleUnambiguousSpacing() }],
			/**
			* Gap X
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-x": [{ "gap-x": scaleUnambiguousSpacing() }],
			/**
			* Gap Y
			* @see https://tailwindcss.com/docs/gap
			*/
			"gap-y": [{ "gap-y": scaleUnambiguousSpacing() }],
			/**
			* Justify Content
			* @see https://tailwindcss.com/docs/justify-content
			*/
			"justify-content": [{ justify: [...scaleAlignPrimaryAxis(), "normal"] }],
			/**
			* Justify Items
			* @see https://tailwindcss.com/docs/justify-items
			*/
			"justify-items": [{ "justify-items": [...scaleAlignSecondaryAxis(), "normal"] }],
			/**
			* Justify Self
			* @see https://tailwindcss.com/docs/justify-self
			*/
			"justify-self": [{ "justify-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Align Content
			* @see https://tailwindcss.com/docs/align-content
			*/
			"align-content": [{ content: ["normal", ...scaleAlignPrimaryAxis()] }],
			/**
			* Align Items
			* @see https://tailwindcss.com/docs/align-items
			*/
			"align-items": [{ items: [...scaleAlignSecondaryAxis(), { baseline: ["", "last"] }] }],
			/**
			* Align Self
			* @see https://tailwindcss.com/docs/align-self
			*/
			"align-self": [{ self: [
				"auto",
				...scaleAlignSecondaryAxis(),
				{ baseline: ["", "last"] }
			] }],
			/**
			* Place Content
			* @see https://tailwindcss.com/docs/place-content
			*/
			"place-content": [{ "place-content": scaleAlignPrimaryAxis() }],
			/**
			* Place Items
			* @see https://tailwindcss.com/docs/place-items
			*/
			"place-items": [{ "place-items": [...scaleAlignSecondaryAxis(), "baseline"] }],
			/**
			* Place Self
			* @see https://tailwindcss.com/docs/place-self
			*/
			"place-self": [{ "place-self": ["auto", ...scaleAlignSecondaryAxis()] }],
			/**
			* Padding
			* @see https://tailwindcss.com/docs/padding
			*/
			p: [{ p: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline
			* @see https://tailwindcss.com/docs/padding
			*/
			px: [{ px: scaleUnambiguousSpacing() }],
			/**
			* Padding Block
			* @see https://tailwindcss.com/docs/padding
			*/
			py: [{ py: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline Start
			* @see https://tailwindcss.com/docs/padding
			*/
			ps: [{ ps: scaleUnambiguousSpacing() }],
			/**
			* Padding Inline End
			* @see https://tailwindcss.com/docs/padding
			*/
			pe: [{ pe: scaleUnambiguousSpacing() }],
			/**
			* Padding Block Start
			* @see https://tailwindcss.com/docs/padding
			*/
			pbs: [{ pbs: scaleUnambiguousSpacing() }],
			/**
			* Padding Block End
			* @see https://tailwindcss.com/docs/padding
			*/
			pbe: [{ pbe: scaleUnambiguousSpacing() }],
			/**
			* Padding Top
			* @see https://tailwindcss.com/docs/padding
			*/
			pt: [{ pt: scaleUnambiguousSpacing() }],
			/**
			* Padding Right
			* @see https://tailwindcss.com/docs/padding
			*/
			pr: [{ pr: scaleUnambiguousSpacing() }],
			/**
			* Padding Bottom
			* @see https://tailwindcss.com/docs/padding
			*/
			pb: [{ pb: scaleUnambiguousSpacing() }],
			/**
			* Padding Left
			* @see https://tailwindcss.com/docs/padding
			*/
			pl: [{ pl: scaleUnambiguousSpacing() }],
			/**
			* Margin
			* @see https://tailwindcss.com/docs/margin
			*/
			m: [{ m: scaleMargin() }],
			/**
			* Margin Inline
			* @see https://tailwindcss.com/docs/margin
			*/
			mx: [{ mx: scaleMargin() }],
			/**
			* Margin Block
			* @see https://tailwindcss.com/docs/margin
			*/
			my: [{ my: scaleMargin() }],
			/**
			* Margin Inline Start
			* @see https://tailwindcss.com/docs/margin
			*/
			ms: [{ ms: scaleMargin() }],
			/**
			* Margin Inline End
			* @see https://tailwindcss.com/docs/margin
			*/
			me: [{ me: scaleMargin() }],
			/**
			* Margin Block Start
			* @see https://tailwindcss.com/docs/margin
			*/
			mbs: [{ mbs: scaleMargin() }],
			/**
			* Margin Block End
			* @see https://tailwindcss.com/docs/margin
			*/
			mbe: [{ mbe: scaleMargin() }],
			/**
			* Margin Top
			* @see https://tailwindcss.com/docs/margin
			*/
			mt: [{ mt: scaleMargin() }],
			/**
			* Margin Right
			* @see https://tailwindcss.com/docs/margin
			*/
			mr: [{ mr: scaleMargin() }],
			/**
			* Margin Bottom
			* @see https://tailwindcss.com/docs/margin
			*/
			mb: [{ mb: scaleMargin() }],
			/**
			* Margin Left
			* @see https://tailwindcss.com/docs/margin
			*/
			ml: [{ ml: scaleMargin() }],
			/**
			* Space Between X
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x": [{ "space-x": scaleUnambiguousSpacing() }],
			/**
			* Space Between X Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-x-reverse": ["space-x-reverse"],
			/**
			* Space Between Y
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y": [{ "space-y": scaleUnambiguousSpacing() }],
			/**
			* Space Between Y Reverse
			* @see https://tailwindcss.com/docs/margin#adding-space-between-children
			*/
			"space-y-reverse": ["space-y-reverse"],
			/**
			* Size
			* @see https://tailwindcss.com/docs/width#setting-both-width-and-height
			*/
			size: [{ size: scaleSizing() }],
			/**
			* Inline Size
			* @see https://tailwindcss.com/docs/width
			*/
			"inline-size": [{ inline: ["auto", ...scaleSizingInline()] }],
			/**
			* Min-Inline Size
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-inline-size": [{ "min-inline": ["auto", ...scaleSizingInline()] }],
			/**
			* Max-Inline Size
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-inline-size": [{ "max-inline": ["none", ...scaleSizingInline()] }],
			/**
			* Block Size
			* @see https://tailwindcss.com/docs/height
			*/
			"block-size": [{ block: ["auto", ...scaleSizingBlock()] }],
			/**
			* Min-Block Size
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-block-size": [{ "min-block": ["auto", ...scaleSizingBlock()] }],
			/**
			* Max-Block Size
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-block-size": [{ "max-block": ["none", ...scaleSizingBlock()] }],
			/**
			* Width
			* @see https://tailwindcss.com/docs/width
			*/
			w: [{ w: [
				themeContainer,
				"screen",
				...scaleSizing()
			] }],
			/**
			* Min-Width
			* @see https://tailwindcss.com/docs/min-width
			*/
			"min-w": [{ "min-w": [
				themeContainer,
				"screen",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Width
			* @see https://tailwindcss.com/docs/max-width
			*/
			"max-w": [{ "max-w": [
				themeContainer,
				"screen",
				"none",
				"prose",
				(
				/** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
				{ screen: [themeBreakpoint] }),
				...scaleSizing()
			] }],
			/**
			* Height
			* @see https://tailwindcss.com/docs/height
			*/
			h: [{ h: [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Min-Height
			* @see https://tailwindcss.com/docs/min-height
			*/
			"min-h": [{ "min-h": [
				"screen",
				"lh",
				"none",
				...scaleSizing()
			] }],
			/**
			* Max-Height
			* @see https://tailwindcss.com/docs/max-height
			*/
			"max-h": [{ "max-h": [
				"screen",
				"lh",
				...scaleSizing()
			] }],
			/**
			* Font Size
			* @see https://tailwindcss.com/docs/font-size
			*/
			"font-size": [{ text: [
				"base",
				themeText,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Font Smoothing
			* @see https://tailwindcss.com/docs/font-smoothing
			*/
			"font-smoothing": ["antialiased", "subpixel-antialiased"],
			/**
			* Font Style
			* @see https://tailwindcss.com/docs/font-style
			*/
			"font-style": ["italic", "not-italic"],
			/**
			* Font Weight
			* @see https://tailwindcss.com/docs/font-weight
			*/
			"font-weight": [{ font: [
				themeFontWeight,
				isArbitraryVariableWeight,
				isArbitraryWeight
			] }],
			/**
			* Font Stretch
			* @see https://tailwindcss.com/docs/font-stretch
			*/
			"font-stretch": [{ "font-stretch": [
				"ultra-condensed",
				"extra-condensed",
				"condensed",
				"semi-condensed",
				"normal",
				"semi-expanded",
				"expanded",
				"extra-expanded",
				"ultra-expanded",
				isPercent,
				isArbitraryValue
			] }],
			/**
			* Font Family
			* @see https://tailwindcss.com/docs/font-family
			*/
			"font-family": [{ font: [
				isArbitraryVariableFamilyName,
				isArbitraryFamilyName,
				themeFont
			] }],
			/**
			* Font Feature Settings
			* @see https://tailwindcss.com/docs/font-feature-settings
			*/
			"font-features": [{ "font-features": [isArbitraryValue] }],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-normal": ["normal-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-ordinal": ["ordinal"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-slashed-zero": ["slashed-zero"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-figure": ["lining-nums", "oldstyle-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-spacing": ["proportional-nums", "tabular-nums"],
			/**
			* Font Variant Numeric
			* @see https://tailwindcss.com/docs/font-variant-numeric
			*/
			"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
			/**
			* Letter Spacing
			* @see https://tailwindcss.com/docs/letter-spacing
			*/
			tracking: [{ tracking: [
				themeTracking,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Line Clamp
			* @see https://tailwindcss.com/docs/line-clamp
			*/
			"line-clamp": [{ "line-clamp": [
				isNumber,
				"none",
				isArbitraryVariable,
				isArbitraryNumber
			] }],
			/**
			* Line Height
			* @see https://tailwindcss.com/docs/line-height
			*/
			leading: [{ leading: [themeLeading, ...scaleUnambiguousSpacing()] }],
			/**
			* List Style Image
			* @see https://tailwindcss.com/docs/list-style-image
			*/
			"list-image": [{ "list-image": [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* List Style Position
			* @see https://tailwindcss.com/docs/list-style-position
			*/
			"list-style-position": [{ list: ["inside", "outside"] }],
			/**
			* List Style Type
			* @see https://tailwindcss.com/docs/list-style-type
			*/
			"list-style-type": [{ list: [
				"disc",
				"decimal",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Alignment
			* @see https://tailwindcss.com/docs/text-align
			*/
			"text-alignment": [{ text: [
				"left",
				"center",
				"right",
				"justify",
				"start",
				"end"
			] }],
			/**
			* Placeholder Color
			* @deprecated since Tailwind CSS v3.0.0
			* @see https://v3.tailwindcss.com/docs/placeholder-color
			*/
			"placeholder-color": [{ placeholder: scaleColor() }],
			/**
			* Text Color
			* @see https://tailwindcss.com/docs/text-color
			*/
			"text-color": [{ text: scaleColor() }],
			/**
			* Text Decoration
			* @see https://tailwindcss.com/docs/text-decoration
			*/
			"text-decoration": [
				"underline",
				"overline",
				"line-through",
				"no-underline"
			],
			/**
			* Text Decoration Style
			* @see https://tailwindcss.com/docs/text-decoration-style
			*/
			"text-decoration-style": [{ decoration: [...scaleLineStyle(), "wavy"] }],
			/**
			* Text Decoration Thickness
			* @see https://tailwindcss.com/docs/text-decoration-thickness
			*/
			"text-decoration-thickness": [{ decoration: [
				isNumber,
				"from-font",
				"auto",
				isArbitraryVariable,
				isArbitraryLength
			] }],
			/**
			* Text Decoration Color
			* @see https://tailwindcss.com/docs/text-decoration-color
			*/
			"text-decoration-color": [{ decoration: scaleColor() }],
			/**
			* Text Underline Offset
			* @see https://tailwindcss.com/docs/text-underline-offset
			*/
			"underline-offset": [{ "underline-offset": [
				isNumber,
				"auto",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Text Transform
			* @see https://tailwindcss.com/docs/text-transform
			*/
			"text-transform": [
				"uppercase",
				"lowercase",
				"capitalize",
				"normal-case"
			],
			/**
			* Text Overflow
			* @see https://tailwindcss.com/docs/text-overflow
			*/
			"text-overflow": [
				"truncate",
				"text-ellipsis",
				"text-clip"
			],
			/**
			* Text Wrap
			* @see https://tailwindcss.com/docs/text-wrap
			*/
			"text-wrap": [{ text: [
				"wrap",
				"nowrap",
				"balance",
				"pretty"
			] }],
			/**
			* Text Indent
			* @see https://tailwindcss.com/docs/text-indent
			*/
			indent: [{ indent: scaleUnambiguousSpacing() }],
			/**
			* Tab Size
			* @see https://tailwindcss.com/docs/tab-size
			*/
			"tab-size": [{ tab: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Vertical Alignment
			* @see https://tailwindcss.com/docs/vertical-align
			*/
			"vertical-align": [{ align: [
				"baseline",
				"top",
				"middle",
				"bottom",
				"text-top",
				"text-bottom",
				"sub",
				"super",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Whitespace
			* @see https://tailwindcss.com/docs/whitespace
			*/
			whitespace: [{ whitespace: [
				"normal",
				"nowrap",
				"pre",
				"pre-line",
				"pre-wrap",
				"break-spaces"
			] }],
			/**
			* Word Break
			* @see https://tailwindcss.com/docs/word-break
			*/
			break: [{ break: [
				"normal",
				"words",
				"all",
				"keep"
			] }],
			/**
			* Overflow Wrap
			* @see https://tailwindcss.com/docs/overflow-wrap
			*/
			wrap: [{ wrap: [
				"break-word",
				"anywhere",
				"normal"
			] }],
			/**
			* Hyphens
			* @see https://tailwindcss.com/docs/hyphens
			*/
			hyphens: [{ hyphens: [
				"none",
				"manual",
				"auto"
			] }],
			/**
			* Content
			* @see https://tailwindcss.com/docs/content
			*/
			content: [{ content: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Background Attachment
			* @see https://tailwindcss.com/docs/background-attachment
			*/
			"bg-attachment": [{ bg: [
				"fixed",
				"local",
				"scroll"
			] }],
			/**
			* Background Clip
			* @see https://tailwindcss.com/docs/background-clip
			*/
			"bg-clip": [{ "bg-clip": [
				"border",
				"padding",
				"content",
				"text"
			] }],
			/**
			* Background Origin
			* @see https://tailwindcss.com/docs/background-origin
			*/
			"bg-origin": [{ "bg-origin": [
				"border",
				"padding",
				"content"
			] }],
			/**
			* Background Position
			* @see https://tailwindcss.com/docs/background-position
			*/
			"bg-position": [{ bg: scaleBgPosition() }],
			/**
			* Background Repeat
			* @see https://tailwindcss.com/docs/background-repeat
			*/
			"bg-repeat": [{ bg: scaleBgRepeat() }],
			/**
			* Background Size
			* @see https://tailwindcss.com/docs/background-size
			*/
			"bg-size": [{ bg: scaleBgSize() }],
			/**
			* Background Image
			* @see https://tailwindcss.com/docs/background-image
			*/
			"bg-image": [{ bg: [
				"none",
				{
					linear: [
						{ to: [
							"t",
							"tr",
							"r",
							"br",
							"b",
							"bl",
							"l",
							"tl"
						] },
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					],
					radial: [
						"",
						isArbitraryVariable,
						isArbitraryValue
					],
					conic: [
						isInteger,
						isArbitraryVariable,
						isArbitraryValue
					]
				},
				isArbitraryVariableImage,
				isArbitraryImage
			] }],
			/**
			* Background Color
			* @see https://tailwindcss.com/docs/background-color
			*/
			"bg-color": [{ bg: scaleColor() }],
			/**
			* Gradient Color Stops From Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from-pos": [{ from: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops Via Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via-pos": [{ via: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops To Position
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to-pos": [{ to: scaleGradientStopPosition() }],
			/**
			* Gradient Color Stops From
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-from": [{ from: scaleColor() }],
			/**
			* Gradient Color Stops Via
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-via": [{ via: scaleColor() }],
			/**
			* Gradient Color Stops To
			* @see https://tailwindcss.com/docs/gradient-color-stops
			*/
			"gradient-to": [{ to: scaleColor() }],
			/**
			* Border Radius
			* @see https://tailwindcss.com/docs/border-radius
			*/
			rounded: [{ rounded: scaleRadius() }],
			/**
			* Border Radius Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-s": [{ "rounded-s": scaleRadius() }],
			/**
			* Border Radius End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-e": [{ "rounded-e": scaleRadius() }],
			/**
			* Border Radius Top
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-t": [{ "rounded-t": scaleRadius() }],
			/**
			* Border Radius Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-r": [{ "rounded-r": scaleRadius() }],
			/**
			* Border Radius Bottom
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-b": [{ "rounded-b": scaleRadius() }],
			/**
			* Border Radius Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-l": [{ "rounded-l": scaleRadius() }],
			/**
			* Border Radius Start Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ss": [{ "rounded-ss": scaleRadius() }],
			/**
			* Border Radius Start End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-se": [{ "rounded-se": scaleRadius() }],
			/**
			* Border Radius End End
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-ee": [{ "rounded-ee": scaleRadius() }],
			/**
			* Border Radius End Start
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-es": [{ "rounded-es": scaleRadius() }],
			/**
			* Border Radius Top Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tl": [{ "rounded-tl": scaleRadius() }],
			/**
			* Border Radius Top Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-tr": [{ "rounded-tr": scaleRadius() }],
			/**
			* Border Radius Bottom Right
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-br": [{ "rounded-br": scaleRadius() }],
			/**
			* Border Radius Bottom Left
			* @see https://tailwindcss.com/docs/border-radius
			*/
			"rounded-bl": [{ "rounded-bl": scaleRadius() }],
			/**
			* Border Width
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w": [{ border: scaleBorderWidth() }],
			/**
			* Border Width Inline
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-x": [{ "border-x": scaleBorderWidth() }],
			/**
			* Border Width Block
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-y": [{ "border-y": scaleBorderWidth() }],
			/**
			* Border Width Inline Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-s": [{ "border-s": scaleBorderWidth() }],
			/**
			* Border Width Inline End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-e": [{ "border-e": scaleBorderWidth() }],
			/**
			* Border Width Block Start
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-bs": [{ "border-bs": scaleBorderWidth() }],
			/**
			* Border Width Block End
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-be": [{ "border-be": scaleBorderWidth() }],
			/**
			* Border Width Top
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-t": [{ "border-t": scaleBorderWidth() }],
			/**
			* Border Width Right
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-r": [{ "border-r": scaleBorderWidth() }],
			/**
			* Border Width Bottom
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-b": [{ "border-b": scaleBorderWidth() }],
			/**
			* Border Width Left
			* @see https://tailwindcss.com/docs/border-width
			*/
			"border-w-l": [{ "border-l": scaleBorderWidth() }],
			/**
			* Divide Width X
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x": [{ "divide-x": scaleBorderWidth() }],
			/**
			* Divide Width X Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-x-reverse": ["divide-x-reverse"],
			/**
			* Divide Width Y
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y": [{ "divide-y": scaleBorderWidth() }],
			/**
			* Divide Width Y Reverse
			* @see https://tailwindcss.com/docs/border-width#between-children
			*/
			"divide-y-reverse": ["divide-y-reverse"],
			/**
			* Border Style
			* @see https://tailwindcss.com/docs/border-style
			*/
			"border-style": [{ border: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Divide Style
			* @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
			*/
			"divide-style": [{ divide: [
				...scaleLineStyle(),
				"hidden",
				"none"
			] }],
			/**
			* Border Color
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color": [{ border: scaleColor() }],
			/**
			* Border Color Inline
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-x": [{ "border-x": scaleColor() }],
			/**
			* Border Color Block
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-y": [{ "border-y": scaleColor() }],
			/**
			* Border Color Inline Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-s": [{ "border-s": scaleColor() }],
			/**
			* Border Color Inline End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-e": [{ "border-e": scaleColor() }],
			/**
			* Border Color Block Start
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-bs": [{ "border-bs": scaleColor() }],
			/**
			* Border Color Block End
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-be": [{ "border-be": scaleColor() }],
			/**
			* Border Color Top
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-t": [{ "border-t": scaleColor() }],
			/**
			* Border Color Right
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-r": [{ "border-r": scaleColor() }],
			/**
			* Border Color Bottom
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-b": [{ "border-b": scaleColor() }],
			/**
			* Border Color Left
			* @see https://tailwindcss.com/docs/border-color
			*/
			"border-color-l": [{ "border-l": scaleColor() }],
			/**
			* Divide Color
			* @see https://tailwindcss.com/docs/divide-color
			*/
			"divide-color": [{ divide: scaleColor() }],
			/**
			* Outline Style
			* @see https://tailwindcss.com/docs/outline-style
			*/
			"outline-style": [{ outline: [
				...scaleLineStyle(),
				"none",
				"hidden"
			] }],
			/**
			* Outline Offset
			* @see https://tailwindcss.com/docs/outline-offset
			*/
			"outline-offset": [{ "outline-offset": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Outline Width
			* @see https://tailwindcss.com/docs/outline-width
			*/
			"outline-w": [{ outline: [
				"",
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength
			] }],
			/**
			* Outline Color
			* @see https://tailwindcss.com/docs/outline-color
			*/
			"outline-color": [{ outline: scaleColor() }],
			/**
			* Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow
			*/
			shadow: [{ shadow: [
				"",
				"none",
				themeShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
			*/
			"shadow-color": [{ shadow: scaleColor() }],
			/**
			* Inset Box Shadow
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
			*/
			"inset-shadow": [{ "inset-shadow": [
				"none",
				themeInsetShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Inset Box Shadow Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
			*/
			"inset-shadow-color": [{ "inset-shadow": scaleColor() }],
			/**
			* Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
			*/
			"ring-w": [{ ring: scaleBorderWidth() }],
			/**
			* Ring Width Inset
			* @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-w-inset": ["ring-inset"],
			/**
			* Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
			*/
			"ring-color": [{ ring: scaleColor() }],
			/**
			* Ring Offset Width
			* @see https://v3.tailwindcss.com/docs/ring-offset-width
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-w": [{ "ring-offset": [isNumber, isArbitraryLength] }],
			/**
			* Ring Offset Color
			* @see https://v3.tailwindcss.com/docs/ring-offset-color
			* @deprecated since Tailwind CSS v4.0.0
			* @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
			*/
			"ring-offset-color": [{ "ring-offset": scaleColor() }],
			/**
			* Inset Ring Width
			* @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
			*/
			"inset-ring-w": [{ "inset-ring": scaleBorderWidth() }],
			/**
			* Inset Ring Color
			* @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
			*/
			"inset-ring-color": [{ "inset-ring": scaleColor() }],
			/**
			* Text Shadow
			* @see https://tailwindcss.com/docs/text-shadow
			*/
			"text-shadow": [{ "text-shadow": [
				"none",
				themeTextShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Text Shadow Color
			* @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
			*/
			"text-shadow-color": [{ "text-shadow": scaleColor() }],
			/**
			* Opacity
			* @see https://tailwindcss.com/docs/opacity
			*/
			opacity: [{ opacity: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Mix Blend Mode
			* @see https://tailwindcss.com/docs/mix-blend-mode
			*/
			"mix-blend": [{ "mix-blend": [
				...scaleBlendMode(),
				"plus-darker",
				"plus-lighter"
			] }],
			/**
			* Background Blend Mode
			* @see https://tailwindcss.com/docs/background-blend-mode
			*/
			"bg-blend": [{ "bg-blend": scaleBlendMode() }],
			/**
			* Mask Clip
			* @see https://tailwindcss.com/docs/mask-clip
			*/
			"mask-clip": [{ "mask-clip": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }, "mask-no-clip"],
			/**
			* Mask Composite
			* @see https://tailwindcss.com/docs/mask-composite
			*/
			"mask-composite": [{ mask: [
				"add",
				"subtract",
				"intersect",
				"exclude"
			] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image-linear-pos": [{ "mask-linear": [isNumber] }],
			"mask-image-linear-from-pos": [{ "mask-linear-from": scaleMaskImagePosition() }],
			"mask-image-linear-to-pos": [{ "mask-linear-to": scaleMaskImagePosition() }],
			"mask-image-linear-from-color": [{ "mask-linear-from": scaleColor() }],
			"mask-image-linear-to-color": [{ "mask-linear-to": scaleColor() }],
			"mask-image-t-from-pos": [{ "mask-t-from": scaleMaskImagePosition() }],
			"mask-image-t-to-pos": [{ "mask-t-to": scaleMaskImagePosition() }],
			"mask-image-t-from-color": [{ "mask-t-from": scaleColor() }],
			"mask-image-t-to-color": [{ "mask-t-to": scaleColor() }],
			"mask-image-r-from-pos": [{ "mask-r-from": scaleMaskImagePosition() }],
			"mask-image-r-to-pos": [{ "mask-r-to": scaleMaskImagePosition() }],
			"mask-image-r-from-color": [{ "mask-r-from": scaleColor() }],
			"mask-image-r-to-color": [{ "mask-r-to": scaleColor() }],
			"mask-image-b-from-pos": [{ "mask-b-from": scaleMaskImagePosition() }],
			"mask-image-b-to-pos": [{ "mask-b-to": scaleMaskImagePosition() }],
			"mask-image-b-from-color": [{ "mask-b-from": scaleColor() }],
			"mask-image-b-to-color": [{ "mask-b-to": scaleColor() }],
			"mask-image-l-from-pos": [{ "mask-l-from": scaleMaskImagePosition() }],
			"mask-image-l-to-pos": [{ "mask-l-to": scaleMaskImagePosition() }],
			"mask-image-l-from-color": [{ "mask-l-from": scaleColor() }],
			"mask-image-l-to-color": [{ "mask-l-to": scaleColor() }],
			"mask-image-x-from-pos": [{ "mask-x-from": scaleMaskImagePosition() }],
			"mask-image-x-to-pos": [{ "mask-x-to": scaleMaskImagePosition() }],
			"mask-image-x-from-color": [{ "mask-x-from": scaleColor() }],
			"mask-image-x-to-color": [{ "mask-x-to": scaleColor() }],
			"mask-image-y-from-pos": [{ "mask-y-from": scaleMaskImagePosition() }],
			"mask-image-y-to-pos": [{ "mask-y-to": scaleMaskImagePosition() }],
			"mask-image-y-from-color": [{ "mask-y-from": scaleColor() }],
			"mask-image-y-to-color": [{ "mask-y-to": scaleColor() }],
			"mask-image-radial": [{ "mask-radial": [isArbitraryVariable, isArbitraryValue] }],
			"mask-image-radial-from-pos": [{ "mask-radial-from": scaleMaskImagePosition() }],
			"mask-image-radial-to-pos": [{ "mask-radial-to": scaleMaskImagePosition() }],
			"mask-image-radial-from-color": [{ "mask-radial-from": scaleColor() }],
			"mask-image-radial-to-color": [{ "mask-radial-to": scaleColor() }],
			"mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
			"mask-image-radial-size": [{ "mask-radial": [{
				closest: ["side", "corner"],
				farthest: ["side", "corner"]
			}] }],
			"mask-image-radial-pos": [{ "mask-radial-at": scalePosition() }],
			"mask-image-conic-pos": [{ "mask-conic": [isNumber] }],
			"mask-image-conic-from-pos": [{ "mask-conic-from": scaleMaskImagePosition() }],
			"mask-image-conic-to-pos": [{ "mask-conic-to": scaleMaskImagePosition() }],
			"mask-image-conic-from-color": [{ "mask-conic-from": scaleColor() }],
			"mask-image-conic-to-color": [{ "mask-conic-to": scaleColor() }],
			/**
			* Mask Mode
			* @see https://tailwindcss.com/docs/mask-mode
			*/
			"mask-mode": [{ mask: [
				"alpha",
				"luminance",
				"match"
			] }],
			/**
			* Mask Origin
			* @see https://tailwindcss.com/docs/mask-origin
			*/
			"mask-origin": [{ "mask-origin": [
				"border",
				"padding",
				"content",
				"fill",
				"stroke",
				"view"
			] }],
			/**
			* Mask Position
			* @see https://tailwindcss.com/docs/mask-position
			*/
			"mask-position": [{ mask: scaleBgPosition() }],
			/**
			* Mask Repeat
			* @see https://tailwindcss.com/docs/mask-repeat
			*/
			"mask-repeat": [{ mask: scaleBgRepeat() }],
			/**
			* Mask Size
			* @see https://tailwindcss.com/docs/mask-size
			*/
			"mask-size": [{ mask: scaleBgSize() }],
			/**
			* Mask Type
			* @see https://tailwindcss.com/docs/mask-type
			*/
			"mask-type": [{ "mask-type": ["alpha", "luminance"] }],
			/**
			* Mask Image
			* @see https://tailwindcss.com/docs/mask-image
			*/
			"mask-image": [{ mask: [
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Filter
			* @see https://tailwindcss.com/docs/filter
			*/
			filter: [{ filter: [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Blur
			* @see https://tailwindcss.com/docs/blur
			*/
			blur: [{ blur: scaleBlur() }],
			/**
			* Brightness
			* @see https://tailwindcss.com/docs/brightness
			*/
			brightness: [{ brightness: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Contrast
			* @see https://tailwindcss.com/docs/contrast
			*/
			contrast: [{ contrast: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Drop Shadow
			* @see https://tailwindcss.com/docs/drop-shadow
			*/
			"drop-shadow": [{ "drop-shadow": [
				"",
				"none",
				themeDropShadow,
				isArbitraryVariableShadow,
				isArbitraryShadow
			] }],
			/**
			* Drop Shadow Color
			* @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
			*/
			"drop-shadow-color": [{ "drop-shadow": scaleColor() }],
			/**
			* Grayscale
			* @see https://tailwindcss.com/docs/grayscale
			*/
			grayscale: [{ grayscale: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Hue Rotate
			* @see https://tailwindcss.com/docs/hue-rotate
			*/
			"hue-rotate": [{ "hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Invert
			* @see https://tailwindcss.com/docs/invert
			*/
			invert: [{ invert: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Saturate
			* @see https://tailwindcss.com/docs/saturate
			*/
			saturate: [{ saturate: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Sepia
			* @see https://tailwindcss.com/docs/sepia
			*/
			sepia: [{ sepia: [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Filter
			* @see https://tailwindcss.com/docs/backdrop-filter
			*/
			"backdrop-filter": [{ "backdrop-filter": [
				"",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Blur
			* @see https://tailwindcss.com/docs/backdrop-blur
			*/
			"backdrop-blur": [{ "backdrop-blur": scaleBlur() }],
			/**
			* Backdrop Brightness
			* @see https://tailwindcss.com/docs/backdrop-brightness
			*/
			"backdrop-brightness": [{ "backdrop-brightness": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Contrast
			* @see https://tailwindcss.com/docs/backdrop-contrast
			*/
			"backdrop-contrast": [{ "backdrop-contrast": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Grayscale
			* @see https://tailwindcss.com/docs/backdrop-grayscale
			*/
			"backdrop-grayscale": [{ "backdrop-grayscale": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Hue Rotate
			* @see https://tailwindcss.com/docs/backdrop-hue-rotate
			*/
			"backdrop-hue-rotate": [{ "backdrop-hue-rotate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Invert
			* @see https://tailwindcss.com/docs/backdrop-invert
			*/
			"backdrop-invert": [{ "backdrop-invert": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Opacity
			* @see https://tailwindcss.com/docs/backdrop-opacity
			*/
			"backdrop-opacity": [{ "backdrop-opacity": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Saturate
			* @see https://tailwindcss.com/docs/backdrop-saturate
			*/
			"backdrop-saturate": [{ "backdrop-saturate": [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backdrop Sepia
			* @see https://tailwindcss.com/docs/backdrop-sepia
			*/
			"backdrop-sepia": [{ "backdrop-sepia": [
				"",
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Border Collapse
			* @see https://tailwindcss.com/docs/border-collapse
			*/
			"border-collapse": [{ border: ["collapse", "separate"] }],
			/**
			* Border Spacing
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing": [{ "border-spacing": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing X
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-x": [{ "border-spacing-x": scaleUnambiguousSpacing() }],
			/**
			* Border Spacing Y
			* @see https://tailwindcss.com/docs/border-spacing
			*/
			"border-spacing-y": [{ "border-spacing-y": scaleUnambiguousSpacing() }],
			/**
			* Table Layout
			* @see https://tailwindcss.com/docs/table-layout
			*/
			"table-layout": [{ table: ["auto", "fixed"] }],
			/**
			* Caption Side
			* @see https://tailwindcss.com/docs/caption-side
			*/
			caption: [{ caption: ["top", "bottom"] }],
			/**
			* Transition Property
			* @see https://tailwindcss.com/docs/transition-property
			*/
			transition: [{ transition: [
				"",
				"all",
				"colors",
				"opacity",
				"shadow",
				"transform",
				"none",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Behavior
			* @see https://tailwindcss.com/docs/transition-behavior
			*/
			"transition-behavior": [{ transition: ["normal", "discrete"] }],
			/**
			* Transition Duration
			* @see https://tailwindcss.com/docs/transition-duration
			*/
			duration: [{ duration: [
				isNumber,
				"initial",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Timing Function
			* @see https://tailwindcss.com/docs/transition-timing-function
			*/
			ease: [{ ease: [
				"linear",
				"initial",
				themeEase,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Transition Delay
			* @see https://tailwindcss.com/docs/transition-delay
			*/
			delay: [{ delay: [
				isNumber,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Animation
			* @see https://tailwindcss.com/docs/animation
			*/
			animate: [{ animate: [
				"none",
				themeAnimate,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Backface Visibility
			* @see https://tailwindcss.com/docs/backface-visibility
			*/
			backface: [{ backface: ["hidden", "visible"] }],
			/**
			* Perspective
			* @see https://tailwindcss.com/docs/perspective
			*/
			perspective: [{ perspective: [
				themePerspective,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Perspective Origin
			* @see https://tailwindcss.com/docs/perspective-origin
			*/
			"perspective-origin": [{ "perspective-origin": scalePositionWithArbitrary() }],
			/**
			* Rotate
			* @see https://tailwindcss.com/docs/rotate
			*/
			rotate: [{ rotate: scaleRotate() }],
			/**
			* Rotate X
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-x": [{ "rotate-x": scaleRotate() }],
			/**
			* Rotate Y
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-y": [{ "rotate-y": scaleRotate() }],
			/**
			* Rotate Z
			* @see https://tailwindcss.com/docs/rotate
			*/
			"rotate-z": [{ "rotate-z": scaleRotate() }],
			/**
			* Scale
			* @see https://tailwindcss.com/docs/scale
			*/
			scale: [{ scale: scaleScale() }],
			/**
			* Scale X
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-x": [{ "scale-x": scaleScale() }],
			/**
			* Scale Y
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-y": [{ "scale-y": scaleScale() }],
			/**
			* Scale Z
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-z": [{ "scale-z": scaleScale() }],
			/**
			* Scale 3D
			* @see https://tailwindcss.com/docs/scale
			*/
			"scale-3d": ["scale-3d"],
			/**
			* Skew
			* @see https://tailwindcss.com/docs/skew
			*/
			skew: [{ skew: scaleSkew() }],
			/**
			* Skew X
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-x": [{ "skew-x": scaleSkew() }],
			/**
			* Skew Y
			* @see https://tailwindcss.com/docs/skew
			*/
			"skew-y": [{ "skew-y": scaleSkew() }],
			/**
			* Transform
			* @see https://tailwindcss.com/docs/transform
			*/
			transform: [{ transform: [
				isArbitraryVariable,
				isArbitraryValue,
				"",
				"none",
				"gpu",
				"cpu"
			] }],
			/**
			* Transform Origin
			* @see https://tailwindcss.com/docs/transform-origin
			*/
			"transform-origin": [{ origin: scalePositionWithArbitrary() }],
			/**
			* Transform Style
			* @see https://tailwindcss.com/docs/transform-style
			*/
			"transform-style": [{ transform: ["3d", "flat"] }],
			/**
			* Translate
			* @see https://tailwindcss.com/docs/translate
			*/
			translate: [{ translate: scaleTranslate() }],
			/**
			* Translate X
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-x": [{ "translate-x": scaleTranslate() }],
			/**
			* Translate Y
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-y": [{ "translate-y": scaleTranslate() }],
			/**
			* Translate Z
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-z": [{ "translate-z": scaleTranslate() }],
			/**
			* Translate None
			* @see https://tailwindcss.com/docs/translate
			*/
			"translate-none": ["translate-none"],
			/**
			* Zoom
			* @see https://tailwindcss.com/docs/zoom
			*/
			zoom: [{ zoom: [
				isInteger,
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Accent Color
			* @see https://tailwindcss.com/docs/accent-color
			*/
			accent: [{ accent: scaleColor() }],
			/**
			* Appearance
			* @see https://tailwindcss.com/docs/appearance
			*/
			appearance: [{ appearance: ["none", "auto"] }],
			/**
			* Caret Color
			* @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
			*/
			"caret-color": [{ caret: scaleColor() }],
			/**
			* Color Scheme
			* @see https://tailwindcss.com/docs/color-scheme
			*/
			"color-scheme": [{ scheme: [
				"normal",
				"dark",
				"light",
				"light-dark",
				"only-dark",
				"only-light"
			] }],
			/**
			* Cursor
			* @see https://tailwindcss.com/docs/cursor
			*/
			cursor: [{ cursor: [
				"auto",
				"default",
				"pointer",
				"wait",
				"text",
				"move",
				"help",
				"not-allowed",
				"none",
				"context-menu",
				"progress",
				"cell",
				"crosshair",
				"vertical-text",
				"alias",
				"copy",
				"no-drop",
				"grab",
				"grabbing",
				"all-scroll",
				"col-resize",
				"row-resize",
				"n-resize",
				"e-resize",
				"s-resize",
				"w-resize",
				"ne-resize",
				"nw-resize",
				"se-resize",
				"sw-resize",
				"ew-resize",
				"ns-resize",
				"nesw-resize",
				"nwse-resize",
				"zoom-in",
				"zoom-out",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Field Sizing
			* @see https://tailwindcss.com/docs/field-sizing
			*/
			"field-sizing": [{ "field-sizing": ["fixed", "content"] }],
			/**
			* Pointer Events
			* @see https://tailwindcss.com/docs/pointer-events
			*/
			"pointer-events": [{ "pointer-events": ["auto", "none"] }],
			/**
			* Resize
			* @see https://tailwindcss.com/docs/resize
			*/
			resize: [{ resize: [
				"none",
				"",
				"y",
				"x"
			] }],
			/**
			* Scroll Behavior
			* @see https://tailwindcss.com/docs/scroll-behavior
			*/
			"scroll-behavior": [{ scroll: ["auto", "smooth"] }],
			/**
			* Scrollbar Thumb Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-thumb-color": [{ "scrollbar-thumb": scaleColor() }],
			/**
			* Scrollbar Track Color
			* @see https://tailwindcss.com/docs/scrollbar-color
			*/
			"scrollbar-track-color": [{ "scrollbar-track": scaleColor() }],
			/**
			* Scrollbar Gutter
			* @see https://tailwindcss.com/docs/scrollbar-gutter
			*/
			"scrollbar-gutter": [{ "scrollbar-gutter": [
				"auto",
				"stable",
				"both"
			] }],
			/**
			* Scrollbar Width
			* @see https://tailwindcss.com/docs/scrollbar-width
			*/
			"scrollbar-w": [{ scrollbar: [
				"auto",
				"thin",
				"none"
			] }],
			/**
			* Scroll Margin
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-m": [{ "scroll-m": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mx": [{ "scroll-mx": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-my": [{ "scroll-my": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ms": [{ "scroll-ms": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Inline End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-me": [{ "scroll-me": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block Start
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbs": [{ "scroll-mbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Block End
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mbe": [{ "scroll-mbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Top
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mt": [{ "scroll-mt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Right
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mr": [{ "scroll-mr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Bottom
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-mb": [{ "scroll-mb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Margin Left
			* @see https://tailwindcss.com/docs/scroll-margin
			*/
			"scroll-ml": [{ "scroll-ml": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-p": [{ "scroll-p": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-px": [{ "scroll-px": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-py": [{ "scroll-py": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-ps": [{ "scroll-ps": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Inline End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pe": [{ "scroll-pe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block Start
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbs": [{ "scroll-pbs": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Block End
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pbe": [{ "scroll-pbe": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Top
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pt": [{ "scroll-pt": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Right
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pr": [{ "scroll-pr": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Bottom
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pb": [{ "scroll-pb": scaleUnambiguousSpacing() }],
			/**
			* Scroll Padding Left
			* @see https://tailwindcss.com/docs/scroll-padding
			*/
			"scroll-pl": [{ "scroll-pl": scaleUnambiguousSpacing() }],
			/**
			* Scroll Snap Align
			* @see https://tailwindcss.com/docs/scroll-snap-align
			*/
			"snap-align": [{ snap: [
				"start",
				"end",
				"center",
				"align-none"
			] }],
			/**
			* Scroll Snap Stop
			* @see https://tailwindcss.com/docs/scroll-snap-stop
			*/
			"snap-stop": [{ snap: ["normal", "always"] }],
			/**
			* Scroll Snap Type
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-type": [{ snap: [
				"none",
				"x",
				"y",
				"both"
			] }],
			/**
			* Scroll Snap Type Strictness
			* @see https://tailwindcss.com/docs/scroll-snap-type
			*/
			"snap-strictness": [{ snap: ["mandatory", "proximity"] }],
			/**
			* Touch Action
			* @see https://tailwindcss.com/docs/touch-action
			*/
			touch: [{ touch: [
				"auto",
				"none",
				"manipulation"
			] }],
			/**
			* Touch Action X
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-x": [{ "touch-pan": [
				"x",
				"left",
				"right"
			] }],
			/**
			* Touch Action Y
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-y": [{ "touch-pan": [
				"y",
				"up",
				"down"
			] }],
			/**
			* Touch Action Pinch Zoom
			* @see https://tailwindcss.com/docs/touch-action
			*/
			"touch-pz": ["touch-pinch-zoom"],
			/**
			* User Select
			* @see https://tailwindcss.com/docs/user-select
			*/
			select: [{ select: [
				"none",
				"text",
				"all",
				"auto"
			] }],
			/**
			* Will Change
			* @see https://tailwindcss.com/docs/will-change
			*/
			"will-change": [{ "will-change": [
				"auto",
				"scroll",
				"contents",
				"transform",
				isArbitraryVariable,
				isArbitraryValue
			] }],
			/**
			* Fill
			* @see https://tailwindcss.com/docs/fill
			*/
			fill: [{ fill: ["none", ...scaleColor()] }],
			/**
			* Stroke Width
			* @see https://tailwindcss.com/docs/stroke-width
			*/
			"stroke-w": [{ stroke: [
				isNumber,
				isArbitraryVariableLength,
				isArbitraryLength,
				isArbitraryNumber
			] }],
			/**
			* Stroke
			* @see https://tailwindcss.com/docs/stroke
			*/
			stroke: [{ stroke: ["none", ...scaleColor()] }],
			/**
			* Forced Color Adjust
			* @see https://tailwindcss.com/docs/forced-color-adjust
			*/
			"forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }]
		},
		conflictingClassGroups: {
			"container-named": ["container-type"],
			overflow: ["overflow-x", "overflow-y"],
			overscroll: ["overscroll-x", "overscroll-y"],
			inset: [
				"inset-x",
				"inset-y",
				"inset-bs",
				"inset-be",
				"start",
				"end",
				"top",
				"right",
				"bottom",
				"left"
			],
			"inset-x": ["right", "left"],
			"inset-y": ["top", "bottom"],
			flex: [
				"basis",
				"grow",
				"shrink"
			],
			gap: ["gap-x", "gap-y"],
			p: [
				"px",
				"py",
				"ps",
				"pe",
				"pbs",
				"pbe",
				"pt",
				"pr",
				"pb",
				"pl"
			],
			px: ["pr", "pl"],
			py: ["pt", "pb"],
			m: [
				"mx",
				"my",
				"ms",
				"me",
				"mbs",
				"mbe",
				"mt",
				"mr",
				"mb",
				"ml"
			],
			mx: ["mr", "ml"],
			my: ["mt", "mb"],
			size: ["w", "h"],
			"font-size": ["leading"],
			"fvn-normal": [
				"fvn-ordinal",
				"fvn-slashed-zero",
				"fvn-figure",
				"fvn-spacing",
				"fvn-fraction"
			],
			"fvn-ordinal": ["fvn-normal"],
			"fvn-slashed-zero": ["fvn-normal"],
			"fvn-figure": ["fvn-normal"],
			"fvn-spacing": ["fvn-normal"],
			"fvn-fraction": ["fvn-normal"],
			"line-clamp": ["display", "overflow"],
			rounded: [
				"rounded-s",
				"rounded-e",
				"rounded-t",
				"rounded-r",
				"rounded-b",
				"rounded-l",
				"rounded-ss",
				"rounded-se",
				"rounded-ee",
				"rounded-es",
				"rounded-tl",
				"rounded-tr",
				"rounded-br",
				"rounded-bl"
			],
			"rounded-s": ["rounded-ss", "rounded-es"],
			"rounded-e": ["rounded-se", "rounded-ee"],
			"rounded-t": ["rounded-tl", "rounded-tr"],
			"rounded-r": ["rounded-tr", "rounded-br"],
			"rounded-b": ["rounded-br", "rounded-bl"],
			"rounded-l": ["rounded-tl", "rounded-bl"],
			"border-spacing": ["border-spacing-x", "border-spacing-y"],
			"border-w": [
				"border-w-x",
				"border-w-y",
				"border-w-s",
				"border-w-e",
				"border-w-bs",
				"border-w-be",
				"border-w-t",
				"border-w-r",
				"border-w-b",
				"border-w-l"
			],
			"border-w-x": ["border-w-r", "border-w-l"],
			"border-w-y": ["border-w-t", "border-w-b"],
			"border-color": [
				"border-color-x",
				"border-color-y",
				"border-color-s",
				"border-color-e",
				"border-color-bs",
				"border-color-be",
				"border-color-t",
				"border-color-r",
				"border-color-b",
				"border-color-l"
			],
			"border-color-x": ["border-color-r", "border-color-l"],
			"border-color-y": ["border-color-t", "border-color-b"],
			translate: [
				"translate-x",
				"translate-y",
				"translate-none"
			],
			"translate-none": [
				"translate",
				"translate-x",
				"translate-y",
				"translate-z"
			],
			"scroll-m": [
				"scroll-mx",
				"scroll-my",
				"scroll-ms",
				"scroll-me",
				"scroll-mbs",
				"scroll-mbe",
				"scroll-mt",
				"scroll-mr",
				"scroll-mb",
				"scroll-ml"
			],
			"scroll-mx": ["scroll-mr", "scroll-ml"],
			"scroll-my": ["scroll-mt", "scroll-mb"],
			"scroll-p": [
				"scroll-px",
				"scroll-py",
				"scroll-ps",
				"scroll-pe",
				"scroll-pbs",
				"scroll-pbe",
				"scroll-pt",
				"scroll-pr",
				"scroll-pb",
				"scroll-pl"
			],
			"scroll-px": ["scroll-pr", "scroll-pl"],
			"scroll-py": ["scroll-pt", "scroll-pb"],
			touch: [
				"touch-x",
				"touch-y",
				"touch-pz"
			],
			"touch-x": ["touch"],
			"touch-y": ["touch"],
			"touch-pz": ["touch"]
		},
		conflictingClassGroupModifiers: { "font-size": ["leading"] },
		postfixLookupClassGroups: ["container-type"],
		orderSensitiveModifiers: [
			"*",
			"**",
			"after",
			"backdrop",
			"before",
			"details-content",
			"file",
			"first-letter",
			"first-line",
			"marker",
			"placeholder",
			"selection"
		]
	};
};
var mergeConfigs = (baseConfig, { extend = {}, override = {} }) => {
	overrideConfigProperties(baseConfig.theme, override.theme);
	overrideConfigProperties(baseConfig.classGroups, override.classGroups);
	overrideConfigProperties(baseConfig.conflictingClassGroups, override.conflictingClassGroups);
	overrideConfigProperties(baseConfig.conflictingClassGroupModifiers, override.conflictingClassGroupModifiers);
	overrideProperty(baseConfig, "postfixLookupClassGroups", override.postfixLookupClassGroups);
	overrideProperty(baseConfig, "orderSensitiveModifiers", override.orderSensitiveModifiers);
	mergeConfigProperties(baseConfig.theme, extend.theme);
	mergeConfigProperties(baseConfig.classGroups, extend.classGroups);
	mergeConfigProperties(baseConfig.conflictingClassGroups, extend.conflictingClassGroups);
	mergeConfigProperties(baseConfig.conflictingClassGroupModifiers, extend.conflictingClassGroupModifiers);
	mergeArrayProperties(baseConfig, extend, "postfixLookupClassGroups");
	mergeArrayProperties(baseConfig, extend, "orderSensitiveModifiers");
	return baseConfig;
};
var overrideProperty = (baseObject, overrideKey, overrideValue) => {
	if (overrideValue !== void 0) baseObject[overrideKey] = overrideValue;
};
var overrideConfigProperties = (baseObject, overrideObject) => {
	if (overrideObject) for (const key in overrideObject) overrideProperty(baseObject, key, overrideObject[key]);
};
var mergeConfigProperties = (baseObject, mergeObject) => {
	if (mergeObject) for (const key in mergeObject) mergeArrayProperties(baseObject, mergeObject, key);
};
var mergeArrayProperties = (baseObject, mergeObject, key) => {
	const mergeValue = mergeObject[key];
	if (mergeValue !== void 0) baseObject[key] = baseObject[key] ? baseObject[key].concat(mergeValue) : mergeValue;
};
var createMerger = (config) => {
	if (!config) return createTailwindMerge(getDefaultConfig);
	return createTailwindMerge(typeof config === "function" ? () => config(getDefaultConfig()) : () => mergeConfigs(getDefaultConfig(), config));
};
var toMergerConfig = (config) => {
	if (isEmptyObject(config)) return void 0;
	const source = config;
	const extend = { ...source.extend ?? {} };
	for (const key of [
		"theme",
		"classGroups",
		"conflictingClassGroups",
		"conflictingClassGroupModifiers",
		"postfixLookupClassGroups",
		"orderSensitiveModifiers",
		"cacheSize",
		"prefix",
		"separator",
		"experimentalParseClassName"
	]) if (source[key] !== void 0 && extend[key] === void 0) extend[key] = source[key];
	const result = {};
	if (Object.keys(extend).length > 0) result.extend = extend;
	if (source.override != null && !isEmptyObject(source.override)) result.override = source.override;
	if (!result.extend && !result.override) return void 0;
	return result;
};
var createTwMerge = (cachedTwMergeConfig) => {
	const merger = createMerger(toMergerConfig(cachedTwMergeConfig));
	return (classList) => merger.mergeString(classList);
};
var defaultMerger;
var getDefaultMerger = () => {
	if (!defaultMerger) defaultMerger = createMerger();
	return defaultMerger;
};
var ensureConfiguredMerger = () => {
	if (!state.cachedTwMerge || state.didTwMergeConfigChange) {
		state.didTwMergeConfigChange = false;
		state.cachedTwMerge = createTwMerge(state.cachedTwMergeConfig);
	}
	return state.cachedTwMerge;
};
var syncTwMergeConfig = (config) => {
	const next = config == null ? void 0 : config.twMergeConfig;
	if (!next || isEmptyObject(next)) return;
	if (!isEqual(next, state.cachedTwMergeConfig)) {
		state.cachedTwMergeConfig = next;
		state.didTwMergeConfigChange = true;
	}
};
var joinArgs = (classnames) => joinClassValue(classnames);
var IS_V8 = (() => {
	const error = /* @__PURE__ */ new Error();
	return !("line" in error) && !("lineNumber" in error);
})();
var ARG_CACHE_BUCKET_SIZE = 64;
var ARG_CACHE_SIZE = 500;
var argCache = /* @__PURE__ */ new Map();
var previousArgCache = /* @__PURE__ */ new Map();
var argCacheCount = 0;
var clearArgCache = () => {
	argCache = /* @__PURE__ */ new Map();
	previousArgCache = /* @__PURE__ */ new Map();
	argCacheCount = 0;
};
var mergeStringDefault = (joined) => {
	if (!joined) return void 0;
	if (joined.indexOf(" ") === -1) return joined;
	return getDefaultMerger().mergeString(joined) || void 0;
};
var storeArgCache = (firstKey, rest, result) => {
	let target = argCache.get(firstKey);
	if (target === void 0) {
		target = [];
		argCache.set(firstKey, target);
	}
	if (target.length >= ARG_CACHE_BUCKET_SIZE) target.shift();
	target.push({
		rest,
		result
	});
	if (++argCacheCount > ARG_CACHE_SIZE) {
		argCacheCount = 0;
		previousArgCache = argCache;
		argCache = /* @__PURE__ */ new Map();
	}
};
var lookupArgCache = (firstKey, firstKeyIndex, truthyStringCount, length, getItem) => {
	let bucket = argCache.get(firstKey);
	if (bucket === void 0) bucket = previousArgCache.get(firstKey);
	if (bucket === void 0) return void 0;
	for (let entryIndex = 0; entryIndex < bucket.length; entryIndex++) {
		const entry = bucket[entryIndex];
		const rest = entry.rest;
		if (rest.length !== truthyStringCount - 1) continue;
		let restIndex = 0;
		let isMatch = true;
		for (let index = firstKeyIndex + 1; index < length; index++) {
			const item = getItem(index);
			if (!item) continue;
			if (item !== rest[restIndex++]) {
				isMatch = false;
				break;
			}
		}
		if (isMatch) return entry.result;
	}
};
var mergeVariadicCached = (inputs) => {
	const length = inputs.length;
	let firstKey = "";
	let firstKeyIndex = -1;
	let truthyStringCount = 0;
	let everyTruthyIsString = true;
	for (let index = 0; index < length; index++) {
		const item = inputs[index];
		if (!item) continue;
		if (typeof item !== "string") {
			everyTruthyIsString = false;
			break;
		}
		if (firstKeyIndex === -1) {
			firstKey = item;
			firstKeyIndex = index;
		}
		truthyStringCount++;
	}
	if (!everyTruthyIsString) return mergeStringDefault(joinArgs(inputs));
	if (truthyStringCount === 0) return void 0;
	if (truthyStringCount === 1) return mergeStringDefault(firstKey);
	const cached = lookupArgCache(firstKey, firstKeyIndex, truthyStringCount, length, (index) => inputs[index]);
	if (cached !== void 0) return cached || void 0;
	let joined = firstKey;
	const rest = [];
	for (let index = firstKeyIndex + 1; index < length; index++) {
		const item = inputs[index];
		if (!item) continue;
		joined += " " + item;
		rest.push(item);
	}
	const result = mergeStringDefault(joined) ?? "";
	storeArgCache(firstKey, rest, result);
	return result || void 0;
};
var originalStateReset = state.reset.bind(state);
state.reset = () => {
	defaultMerger = void 0;
	clearArgCache();
	originalStateReset();
};
var executeMerge = (classnames, config) => {
	const base = joinArgs(classnames);
	if (!base || !((config == null ? void 0 : config.twMerge) ?? true)) return base || void 0;
	if (base.indexOf(" ") === -1) return base;
	syncTwMergeConfig(config);
	return (Boolean((config == null ? void 0 : config.twMergeConfig) && !isEmptyObject(config.twMergeConfig)) ? ensureConfiguredMerger() : getDefaultMerger().mergeString)(base) || void 0;
};
var isDefaultMergeConfig = (config) => {
	if (config == null) return true;
	if (config.twMerge === false) return false;
	if (config.twMergeConfig && !isEmptyObject(config.twMergeConfig)) return false;
	return true;
};
var cnAdapter = (config, ...classnames) => executeMerge(classnames, config);
var cnMerge = (...classnames) => {
	return (config) => {
		if (isDefaultMergeConfig(config)) {
			if (IS_V8) return mergeVariadicCached(classnames);
			return mergeStringDefault(joinArgs(classnames));
		}
		return executeMerge(classnames, config);
	};
};
var runtime = getTailwindVariants(cnAdapter);
var createTV = runtime.createTV;
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/utils/tv.js
var config = inlineConfig.ui?.tv;
var baseTv = /* @__PURE__ */ createTV(config);
function findReplacer(value) {
	if (typeof value === "function") return value;
	if (Array.isArray(value)) for (let i = value.length - 1; i >= 0; i--) {
		const replacer = findReplacer(value[i]);
		if (replacer) return replacer;
	}
}
function plainClasses(value) {
	if (Array.isArray(value)) return value.flatMap((item) => plainClasses(item));
	if (typeof value === "function") return [];
	return [value];
}
function applyReplacer(replacer, slotProps, resolveDefaults) {
	return cnMerge(replacer(resolveDefaults()), ...plainClasses(slotProps.class), ...plainClasses(slotProps.className))(config) ?? "";
}
function isMemoizable(value, depth = 0) {
	if (value === void 0 || value === null) return true;
	const type = typeof value;
	if (type === "string" || type === "boolean") return true;
	if (type === "number") return Number.isFinite(value);
	if (Array.isArray(value)) {
		if (depth >= 4) return false;
		for (const item of value) if (!isMemoizable(item, depth + 1)) return false;
		return true;
	}
	return false;
}
function memoKey(slotProps) {
	const proto = Object.getPrototypeOf(slotProps);
	if (proto !== Object.prototype && proto !== null) return;
	for (const key of Object.keys(slotProps)) if (!isMemoizable(slotProps[key])) return;
	return JSON.stringify(slotProps);
}
function wrapSlots(slots) {
	const memo = /* @__PURE__ */ new Map();
	return new Proxy(slots, { get(target, key) {
		const slot = target[key];
		if (typeof slot !== "function") return slot;
		return (slotProps = {}) => {
			const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className);
			if (!replacer) {
				const cacheKey = memoKey(slotProps);
				if (cacheKey === void 0) return slot(slotProps);
				let cache = memo.get(key);
				if (!cache) {
					cache = /* @__PURE__ */ new Map();
					memo.set(key, cache);
				}
				let result = cache.get(cacheKey);
				if (result === void 0 && !cache.has(cacheKey)) {
					if (cache.size >= 500) cache.clear();
					result = slot(slotProps);
					cache.set(cacheKey, result);
				}
				return result;
			}
			return applyReplacer(replacer, slotProps, () => slot({
				...slotProps,
				class: void 0,
				className: void 0
			}));
		};
	} });
}
function defaultClasses(value) {
	return cnMerge(value)(config) ?? "";
}
function resolveReplacers(componentConfig) {
	if (!componentConfig || typeof componentConfig !== "object") return componentConfig;
	const slots = componentConfig.slots;
	const replacers = slots && typeof slots === "object" ? Object.entries(slots).filter((entry) => typeof entry[1] === "function") : [];
	const baseReplacer = typeof componentConfig.base === "function" ? componentConfig.base : void 0;
	if (!replacers.length && !baseReplacer) return componentConfig;
	const extend = componentConfig.extend;
	const resolved = { ...componentConfig };
	let extendSlots;
	let blankExtendBase = false;
	if (baseReplacer) {
		resolved.base = baseReplacer(defaultClasses(extend?.slots?.base ?? extend?.base));
		if (extend?.slots?.base) {
			extendSlots ??= { ...extend.slots };
			extendSlots.base = "";
		}
		if (extend?.base) blankExtendBase = true;
	}
	if (replacers.length) {
		const cleaned = { ...slots };
		for (const [slot, replacer] of replacers) {
			cleaned[slot] = replacer(defaultClasses(extend?.slots?.[slot]));
			if (extend?.slots?.[slot]) {
				extendSlots ??= { ...extend.slots };
				extendSlots[slot] = "";
			}
		}
		resolved.slots = cleaned;
	}
	if (extendSlots || blankExtendBase) {
		const cleanedExtend = { ...extend };
		if (extendSlots) cleanedExtend.slots = extendSlots;
		if (blankExtendBase) cleanedExtend.base = "";
		resolved.extend = cleanedExtend;
	}
	return resolved;
}
var tv = ((componentConfig) => {
	const component = baseTv(resolveReplacers(componentConfig));
	return new Proxy(component, { apply(target, thisArg, args) {
		const result = Reflect.apply(target, thisArg, args);
		if (result && typeof result === "object") return wrapSlots(result);
		if (typeof result === "string") {
			const slotProps = args[0] ?? {};
			const replacer = findReplacer(slotProps.class) ?? findReplacer(slotProps.className);
			if (replacer) return applyReplacer(replacer, slotProps, () => Reflect.apply(target, thisArg, [{
				...slotProps,
				class: void 0,
				className: void 0
			}]));
		}
		return result;
	} });
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue
var _sfc_main$12 = {
	__name: "UIcon",
	__ssrInlineRender: true,
	props: {
		name: {
			type: null,
			required: true
		},
		mode: {
			type: String,
			required: false
		},
		size: {
			type: [String, Number],
			required: false
		},
		customize: {
			type: [
				Function,
				Boolean,
				null
			],
			required: false
		}
	},
	setup(__props) {
		const iconProps = useForwardProps$1(reactivePick(__props, "mode", "size", "customize"));
		return (_ctx, _push, _parent, _attrs) => {
			if (typeof __props.name === "string") _push(ssrRenderComponent(unref(components_default), mergeProps({ name: __props.name }, unref(iconProps), _attrs), null, _parent));
			else ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.name), _attrs, null), _parent);
		};
	}
};
var _sfc_setup$13 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Icon.vue");
	return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useAvatarGroup.js
var avatarGroupInjectionKey = Symbol("nuxt-ui.avatar-group");
function useAvatarGroup(props) {
	const avatarGroup = inject(avatarGroupInjectionKey, void 0);
	const size = computed(() => props.size ?? avatarGroup?.value.size);
	const color = computed(() => props.color ?? avatarGroup?.value.color);
	provide(avatarGroupInjectionKey, computed(() => ({
		size: size.value,
		color: color.value
	})));
	return {
		size,
		color
	};
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fchip.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fchip_default = {
	"slots": {
		"root": "relative inline-flex items-center justify-center shrink-0",
		"base": "rounded-full ring ring-bg flex items-center justify-center text-inverted font-medium whitespace-nowrap"
	},
	"variants": {
		"color": {
			"primary": "bg-primary",
			"secondary": "bg-secondary",
			"success": "bg-success",
			"info": "bg-info",
			"warning": "bg-warning",
			"error": "bg-error",
			"neutral": "bg-inverted"
		},
		"size": {
			"3xs": "h-[4px] min-w-[4px] text-[4px]",
			"2xs": "h-[5px] min-w-[5px] text-[5px]",
			"xs": "h-[6px] min-w-[6px] text-[6px]",
			"sm": "h-[7px] min-w-[7px] text-[7px]",
			"md": "h-[8px] min-w-[8px] text-[8px]",
			"lg": "h-[9px] min-w-[9px] text-[9px]",
			"xl": "h-[10px] min-w-[10px] text-[10px]",
			"2xl": "h-[11px] min-w-[11px] text-[11px]",
			"3xl": "h-[12px] min-w-[12px] text-[12px]"
		},
		"position": {
			"top-right": "top-0 right-0",
			"bottom-right": "bottom-0 right-0",
			"top-left": "top-0 left-0",
			"bottom-left": "bottom-0 left-0"
		},
		"inset": { "false": "" },
		"standalone": { "false": "absolute" }
	},
	"compoundVariants": [
		{
			"position": "top-right",
			"inset": false,
			"class": "-translate-y-1/2 translate-x-1/2 transform"
		},
		{
			"position": "bottom-right",
			"inset": false,
			"class": "translate-y-1/2 translate-x-1/2 transform"
		},
		{
			"position": "top-left",
			"inset": false,
			"class": "-translate-y-1/2 -translate-x-1/2 transform"
		},
		{
			"position": "bottom-left",
			"inset": false,
			"class": "translate-y-1/2 -translate-x-1/2 transform"
		}
	],
	"defaultVariants": {
		"size": "md",
		"color": "primary",
		"position": "top-right"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue
var _sfc_main$11 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UChip",
	__ssrInlineRender: true,
	props: /*@__PURE__*/ mergeModels({
		as: {
			type: null,
			required: false
		},
		text: {
			type: [String, Number],
			required: false
		},
		color: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		position: {
			type: null,
			required: false
		},
		inset: {
			type: Boolean,
			required: false,
			default: false
		},
		standalone: {
			type: Boolean,
			required: false,
			default: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	}, {
		"show": {
			type: Boolean,
			default: true
		},
		"showModifiers": {}
	}),
	emits: ["update:show"],
	setup(__props) {
		const _props = __props;
		const props = useComponentProps("chip", _props);
		const show = useModel(__props, "show", {
			type: Boolean,
			default: true
		});
		const { size } = useAvatarGroup(_props);
		const appConfig = useAppConfig();
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fchip_default,
			...appConfig.ui?.chip || {}
		})({
			color: props.color,
			size: size.value ?? props.size,
			position: props.position,
			inset: props.inset,
			standalone: props.standalone
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(unref(Slot), {
							..._ctx.$attrs,
							"data-slot": void 0
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default")];
							}),
							_: 3
						}, _parent, _scopeId));
						if (show.value) {
							_push(`<span data-slot="base" class="${ssrRenderClass(ui.value.base({ class: unref(props).ui?.base }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "content", {}, () => {
								_push(`${ssrInterpolate(unref(props).text)}`);
							}, _push, _parent, _scopeId);
							_push(`</span>`);
						} else _push(`<!---->`);
					} else return [createVNode(unref(Slot), {
						..._ctx.$attrs,
						"data-slot": void 0
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16), show.value ? (openBlock(), createBlock("span", {
						key: 0,
						"data-slot": "base",
						class: ui.value.base({ class: unref(props).ui?.base })
					}, [renderSlot(_ctx.$slots, "content", {}, () => [createTextVNode(toDisplayString(unref(props).text), 1)])], 2)) : createCommentVNode("", true)];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$12 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Chip.vue");
	return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Favatar.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Favatar_default = {
	"slots": {
		"root": "inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle",
		"image": "h-full w-full rounded-[inherit] object-cover",
		"fallback": "font-medium truncate",
		"icon": "shrink-0"
	},
	"variants": {
		"color": {
			"primary": {
				"root": "bg-primary/10",
				"fallback": "text-primary",
				"icon": "text-primary"
			},
			"secondary": {
				"root": "bg-secondary/10",
				"fallback": "text-secondary",
				"icon": "text-secondary"
			},
			"success": {
				"root": "bg-success/10",
				"fallback": "text-success",
				"icon": "text-success"
			},
			"info": {
				"root": "bg-info/10",
				"fallback": "text-info",
				"icon": "text-info"
			},
			"warning": {
				"root": "bg-warning/10",
				"fallback": "text-warning",
				"icon": "text-warning"
			},
			"error": {
				"root": "bg-error/10",
				"fallback": "text-error",
				"icon": "text-error"
			},
			"neutral": {
				"root": "bg-elevated",
				"fallback": "text-muted",
				"icon": "text-muted"
			}
		},
		"size": {
			"3xs": { "root": "size-4 text-[8px]" },
			"2xs": { "root": "size-5 text-[10px]" },
			"xs": { "root": "size-6 text-xs" },
			"sm": { "root": "size-7 text-sm" },
			"md": { "root": "size-8 text-base" },
			"lg": { "root": "size-9 text-lg" },
			"xl": { "root": "size-10 text-xl" },
			"2xl": { "root": "size-11 text-[22px]" },
			"3xl": { "root": "size-12 text-2xl" }
		}
	},
	"defaultVariants": {
		"size": "md",
		"color": "neutral"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue
var _sfc_main$10 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "UAvatar",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		src: {
			type: String,
			required: false
		},
		alt: {
			type: String,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		chip: {
			type: [Boolean, Object],
			required: false
		},
		class: {
			type: null,
			required: false
		},
		style: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const props = useComponentProps("avatar", _props);
		const as = computed(() => {
			if (typeof props.as === "string" || typeof props.as?.render === "function") return { root: props.as };
			return defu(props.as, { root: "span" });
		});
		const fallback = computed(() => props.text || (props.alt || "").split(" ").map((word) => word.charAt(0)).join("").substring(0, 2));
		const appConfig = useAppConfig();
		const { size, color } = useAvatarGroup(_props);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Favatar_default,
			...appConfig.ui?.avatar || {}
		})({
			size: size.value ?? props.size,
			color: color.value ?? props.color
		}));
		const rootClass = computed(() => ui.value.root({ class: [props.ui?.root, props.class] }));
		const sizePx = computed(() => {
			const sizeClass = (rootClass.value || "").split(" ").find((c) => /^size-\d+$/.test(c));
			if (sizeClass) {
				const num = Number.parseFloat(sizeClass.split("-")[1] ?? "");
				if (!Number.isNaN(num)) return num * 4;
			}
			return null;
		});
		const error = ref(false);
		watch(() => props.src, () => {
			if (error.value) error.value = false;
		});
		function onError() {
			error.value = true;
		}
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).chip ? _sfc_main$11 : unref(Primitive)), mergeProps({ as: as.value.root }, unref(props).chip ? typeof unref(props).chip === "object" ? {
				inset: true,
				...unref(props).chip
			} : { inset: true } : {}, {
				"data-slot": _ctx.$attrs["data-slot"] ?? "root",
				class: rootClass.value,
				style: unref(props).style
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(props).src && !error.value) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(as.value.img || unref("img")), mergeProps({
							src: unref(props).src,
							alt: unref(props).alt,
							width: sizePx.value,
							height: sizePx.value
						}, _ctx.$attrs, {
							"data-slot": "image",
							class: ui.value.image({ class: unref(props).ui?.image }),
							onError
						}), null), _parent, _scopeId);
						else _push(ssrRenderComponent(unref(Slot), {
							..._ctx.$attrs,
							"data-slot": void 0
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, () => {
									if (unref(props).icon) _push(ssrRenderComponent(_sfc_main$12, {
										name: unref(props).icon,
										"data-slot": "icon",
										class: ui.value.icon({ class: unref(props).ui?.icon })
									}, null, _parent, _scopeId));
									else _push(`<span data-slot="fallback" class="${ssrRenderClass(ui.value.fallback({ class: unref(props).ui?.fallback }))}"${_scopeId}>${ssrInterpolate(fallback.value || "\xA0")}</span>`);
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", {}, () => [unref(props).icon ? (openBlock(), createBlock(_sfc_main$12, {
									key: 0,
									name: unref(props).icon,
									"data-slot": "icon",
									class: ui.value.icon({ class: unref(props).ui?.icon })
								}, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
									key: 1,
									"data-slot": "fallback",
									class: ui.value.fallback({ class: unref(props).ui?.fallback })
								}, toDisplayString(fallback.value || "\xA0"), 3))])];
							}),
							_: 3
						}, _parent, _scopeId));
					} else return [unref(props).src && !error.value ? (openBlock(), createBlock(resolveDynamicComponent(as.value.img || unref("img")), mergeProps({
						key: 0,
						src: unref(props).src,
						alt: unref(props).alt,
						width: sizePx.value,
						height: sizePx.value
					}, _ctx.$attrs, {
						"data-slot": "image",
						class: ui.value.image({ class: unref(props).ui?.image }),
						onError
					}), null, 16, [
						"src",
						"alt",
						"width",
						"height",
						"class"
					])) : (openBlock(), createBlock(unref(Slot), mergeProps({ key: 1 }, {
						..._ctx.$attrs,
						"data-slot": void 0
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [unref(props).icon ? (openBlock(), createBlock(_sfc_main$12, {
							key: 0,
							name: unref(props).icon,
							"data-slot": "icon",
							class: ui.value.icon({ class: unref(props).ui?.icon })
						}, null, 8, ["name", "class"])) : (openBlock(), createBlock("span", {
							key: 1,
							"data-slot": "fallback",
							class: ui.value.fallback({ class: unref(props).ui?.fallback })
						}, toDisplayString(fallback.value || "\xA0"), 3))])]),
						_: 3
					}, 16))];
				}),
				_: 3
			}), _parent);
		};
	}
});
var _sfc_setup$11 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Avatar.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useComponentIcons.js
function useComponentIcons(componentProps) {
	const appConfig = useAppConfig();
	const props = computed(() => toValue(componentProps));
	const isLeading = computed(() => props.value.icon && props.value.leading || props.value.icon && !props.value.trailing || props.value.loading && !props.value.trailing || !!props.value.leadingIcon);
	return {
		isLeading,
		isTrailing: computed(() => props.value.icon && props.value.trailing || props.value.loading && props.value.trailing || !!props.value.trailingIcon && props.value.trailing !== false),
		leadingIconName: computed(() => {
			if (props.value.loading) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.leadingIcon || props.value.icon;
		}),
		trailingIconName: computed(() => {
			if (props.value.loading && !isLeading.value) return props.value.loadingIcon || appConfig.ui.icons.loading;
			return props.value.trailingIcon || props.value.icon;
		})
	};
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useFieldGroup.js
var fieldGroupInjectionKey = Symbol("nuxt-ui.field-group");
function useFieldGroup(props) {
	const fieldGroup = inject(fieldGroupInjectionKey, void 0);
	return {
		orientation: computed(() => fieldGroup?.value.orientation),
		size: computed(() => props?.size ?? fieldGroup?.value.size)
	};
}
var FieldGroupReset = defineComponent({
	name: "FieldGroupReset",
	setup(_, { slots }) {
		provide(fieldGroupInjectionKey, computed(() => ({
			size: void 0,
			orientation: void 0
		})));
		return () => slots.default?.();
	}
});
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useFormField.js
var formOptionsInjectionKey = Symbol("nuxt-ui.form-options");
var formBusInjectionKey = Symbol("nuxt-ui.form-events");
var formFieldInjectionKey = Symbol("nuxt-ui.form-field");
var inputIdInjectionKey = Symbol("nuxt-ui.input-id");
var formLoadingInjectionKey = Symbol("nuxt-ui.form-loading");
function useFormField(props, opts) {
	const formOptions = inject(formOptionsInjectionKey, void 0);
	const formBus = inject(formBusInjectionKey, void 0);
	const formField = inject(formFieldInjectionKey, void 0);
	const inputId = inject(inputIdInjectionKey, void 0);
	provide(formFieldInjectionKey, void 0);
	if (formField && inputId) {
		if (opts?.bind === false) inputId.value = void 0;
		else if (props?.id) inputId.value = props?.id;
	}
	function emitFormEvent(type, name, flags) {
		if (formBus && formField && name) formBus.emit({
			type,
			name,
			...flags
		});
	}
	function emitFormBlur() {
		emitFormEvent("blur", formField?.value.name);
	}
	function emitFormFocus() {
		emitFormEvent("focus", formField?.value.name);
	}
	function emitFormChange() {
		emitFormEvent("change", formField?.value.name);
	}
	let disposed = false;
	if (getCurrentScope()) onScopeDispose(() => {
		disposed = true;
	});
	const validateInput = useDebounceFn(() => {
		if (disposed) return;
		emitFormEvent("input", formField?.value.name, {
			eager: !opts?.deferInputValidation || formField?.value.eagerValidation,
			track: false
		});
	}, formField?.value.validateOnInputDelay ?? formOptions?.value.validateOnInputDelay ?? 0);
	function emitFormInput() {
		emitFormEvent("input", formField?.value.name, { validate: false });
		return validateInput();
	}
	return {
		id: computed(() => props?.id ?? inputId?.value),
		name: computed(() => props?.name ?? formField?.value.name),
		size: computed(() => props?.size ?? formField?.value.size),
		color: computed(() => formField?.value.error ? "error" : props?.color),
		highlight: computed(() => formField?.value.error ? true : props?.highlight || void 0),
		disabled: computed(() => formOptions?.value.disabled || props?.disabled || void 0),
		emitFormBlur,
		emitFormInput,
		emitFormChange,
		emitFormFocus,
		ariaAttrs: computed(() => {
			if (!formField?.value) return;
			const descriptiveAttrs = [
				"error",
				"hint",
				"description",
				"help"
			].filter((type) => formField?.value?.[type]).map((type) => `${formField?.value.ariaId}-${type}`) || [];
			const attrs = { "aria-invalid": !!formField?.value.error };
			if (descriptiveAttrs.length > 0) attrs["aria-describedby"] = descriptiveAttrs.join(" ");
			return attrs;
		})
	};
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/utils/link-keys.js
var linkKeys = [
	"active",
	"activeClass",
	"ariaCurrentValue",
	"as",
	"disabled",
	"download",
	"exact",
	"exactActiveClass",
	"exactHash",
	"exactQuery",
	"external",
	"form",
	"formaction",
	"formenctype",
	"formmethod",
	"formnovalidate",
	"formtarget",
	"href",
	"hreflang",
	"inactiveClass",
	"locale",
	"media",
	"noPrefetch",
	"noRel",
	"onClick",
	"ping",
	"prefetch",
	"prefetchOn",
	"prefetchedClass",
	"referrerpolicy",
	"rel",
	"replace",
	"target",
	"title",
	"to",
	"trailingSlash",
	"type",
	"viewTransition"
];
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/utils/link.js
function pickLinkProps(link) {
	const keys = Object.keys(link);
	const ariaKeys = keys.filter((key) => key.startsWith("aria-"));
	const dataKeys = keys.filter((key) => key.startsWith("data-"));
	return reactivePick(link, ...[
		...linkKeys,
		...ariaKeys,
		...dataKeys
	]);
}
function isPartiallyEqual(item1, item2) {
	const diffedKeys = diff(item1, item2).reduce((filtered, q) => {
		if (q.type === "added") filtered.add(q.key);
		return filtered;
	}, /* @__PURE__ */ new Set());
	const item1Filtered = Object.fromEntries(Object.entries(item1).filter(([key]) => !diffedKeys.has(key)));
	const item2Filtered = Object.fromEntries(Object.entries(item2).filter(([key]) => !diffedKeys.has(key)));
	return isEqual$1(item1Filtered, item2Filtered);
}
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue
var _sfc_main$9 = {
	__name: "ULinkBase",
	__ssrInlineRender: true,
	props: {
		as: {
			type: String,
			required: false,
			default: "button"
		},
		type: {
			type: String,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
			required: false
		},
		href: {
			type: [String, null],
			required: false
		},
		navigate: {
			type: Function,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		isExternal: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		function onClickWrapper(e) {
			if (props.disabled) {
				e.stopPropagation();
				e.preventDefault();
				return;
			}
			const results = [];
			if (props.onClick) for (const onClick of Array.isArray(props.onClick) ? props.onClick : [props.onClick]) results.push(onClick(e));
			if (props.href && props.navigate && !props.isExternal) props.navigate(e);
			return Promise.all(results);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps(__props.href ? {
				"as": "a",
				"href": __props.disabled ? void 0 : __props.href,
				"aria-disabled": __props.disabled ? "true" : void 0,
				"role": __props.disabled ? "link" : void 0,
				"tabindex": __props.disabled ? -1 : void 0
			} : __props.as === "button" ? {
				as: __props.as,
				type: __props.type,
				disabled: __props.disabled
			} : { as: __props.as }, {
				rel: __props.rel,
				target: __props.target,
				onClick: onClickWrapper
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default")];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$10 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/LinkBase.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Flink.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Flink_default = {
	"base": "outline-primary/25 focus-visible:outline-3 rounded-md",
	"variants": {
		"active": {
			"true": "text-primary",
			"false": "text-muted"
		},
		"disabled": { "true": "cursor-not-allowed opacity-75" }
	},
	"compoundVariants": [{
		"active": false,
		"disabled": false,
		"class": ["hover:text-default", "transition-colors"]
	}]
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Link.vue
var _sfc_main$8 = /*@__PURE__*/ Object.assign({ inheritAttrs: false }, {
	__name: "ULink",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false,
			default: "button"
		},
		type: {
			type: null,
			required: false,
			default: "button"
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false,
			default: void 0
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		custom: {
			type: Boolean,
			required: false
		},
		raw: {
			type: Boolean,
			required: false
		},
		locale: {
			type: [Boolean, String],
			required: false,
			default: void 0
		},
		class: {
			type: null,
			required: false
		},
		to: {
			type: null,
			required: false
		},
		href: {
			type: null,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		},
		prefetchedClass: {
			type: String,
			required: false
		},
		prefetch: {
			type: Boolean,
			required: false
		},
		prefetchOn: {
			type: [String, Object],
			required: false
		},
		noPrefetch: {
			type: Boolean,
			required: false
		},
		trailingSlash: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		exactActiveClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false,
			default: "page"
		},
		viewTransition: {
			type: Boolean,
			required: false
		},
		replace: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const route = useRoute$1();
		const appConfig = useAppConfig();
		const nuxtApp = useNuxtApp();
		const nuxtLinkProps = useForwardProps$1(reactiveOmit(props, "as", "type", "disabled", "active", "exact", "exactQuery", "exactHash", "activeClass", "inactiveClass", "to", "href", "raw", "custom", "locale", "class"));
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Flink_default,
			...defu({ variants: { active: {
				true: mergeClasses(appConfig.ui?.link?.variants?.active?.true, props.activeClass),
				false: mergeClasses(appConfig.ui?.link?.variants?.active?.false, props.inactiveClass)
			} } }, appConfig.ui?.link || {})
		}));
		const to = computed(() => {
			const path = props.to ?? props.href;
			if (!path) return path;
			if (typeof path !== "string") return path;
			if (props.external || hasProtocol(path, { acceptRelative: true })) return path;
			if (props.locale === false) return path;
			const localePath = nuxtApp.$localePath;
			if (!localePath) return path;
			const codes = nuxtApp.$i18n?.localeCodes?.value;
			if (codes?.length && new RegExp(`^/(${codes.join("|")})($|[/?#])`).test(path)) return path;
			return localePath(path, typeof props.locale === "string" ? props.locale : void 0) || path;
		});
		const isInternalLink = computed(() => {
			if (!to.value) return false;
			if (props.external) return false;
			if (typeof to.value !== "string") return true;
			if (hasProtocol(to.value, { acceptRelative: true })) return false;
			if (props.target && props.target !== "_self") return false;
			return true;
		});
		const rel = computed(() => {
			if (props.noRel) return null;
			if (props.rel !== void 0) return props.rel || null;
			if (!isInternalLink.value || props.target && props.target !== "_self") return "noopener noreferrer";
			return null;
		});
		function isLinkActive({ route: linkRoute, isActive, isExactActive } = {}) {
			if (props.active !== void 0) return props.active;
			if (!to.value) return false;
			if (props.exactQuery === "partial") {
				if (!isPartiallyEqual(linkRoute.query, route.query)) return false;
			} else if (props.exactQuery === true) {
				if (!isEqual$1(linkRoute.query, route.query)) return false;
			}
			if (props.exactHash && linkRoute.hash !== route.hash) return false;
			if (props.exact && isExactActive) return true;
			if (!props.exact && isActive) return true;
			return false;
		}
		function resolveLinkClass({ route: route2, isActive, isExactActive, prefetched } = {}) {
			const active = isLinkActive({
				route: route2,
				isActive,
				isExactActive
			});
			const prefetchedClass = prefetched ? props.prefetchedClass : void 0;
			if (props.raw) return [
				props.class,
				active ? props.activeClass : props.inactiveClass,
				prefetchedClass
			];
			return ui.value({
				class: prefetchedClass ? [props.class, prefetchedClass] : props.class,
				active,
				disabled: props.disabled
			});
		}
		getCurrentInstance();
		let prefetchApi;
		function onPrefetch() {
			prefetchApi?.prefetch?.(nuxtApp);
		}
		function getPrefetchListeners({ prefetch, shouldPrefetch }, attrs) {
			if (!prefetch || !shouldPrefetch) return;
			prefetchApi = {
				prefetch,
				shouldPrefetch
			};
			if (!shouldPrefetch("interaction")) return;
			return mergeProps({
				onPointerenter: attrs.onPointerenter,
				onFocus: attrs.onFocus
			}, {
				onPointerenter: onPrefetch,
				onFocus: onPrefetch
			});
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			if (isInternalLink.value) _push(ssrRenderComponent(_component_NuxtLink, mergeProps(unref(nuxtLinkProps), {
				to: to.value,
				custom: ""
			}, _attrs), {
				default: withCtx(({ href, navigate, route: linkRoute, isActive, isExactActive, ...rest }, _push, _parent, _scopeId) => {
					if (_push) {
						if (__props.custom) _push(ssrRenderComponent(unref(Slot), null, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", {
									..._ctx.$attrs,
									...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
									...rest.prefetched && __props.prefetchedClass ? { class: __props.prefetchedClass } : {},
									...getPrefetchListeners(rest, _ctx.$attrs),
									as: __props.as,
									type: __props.type,
									disabled: __props.disabled,
									href,
									navigate,
									rel: rel.value,
									target: rest.target,
									isExternal: rest.isExternal,
									active: isLinkActive({
										route: linkRoute,
										isActive,
										isExactActive
									})
								}, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", {
									..._ctx.$attrs,
									...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
									...rest.prefetched && __props.prefetchedClass ? { class: __props.prefetchedClass } : {},
									...getPrefetchListeners(rest, _ctx.$attrs),
									as: __props.as,
									type: __props.type,
									disabled: __props.disabled,
									href,
									navigate,
									rel: rel.value,
									target: rest.target,
									isExternal: rest.isExternal,
									active: isLinkActive({
										route: linkRoute,
										isActive,
										isExactActive
									})
								})];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(ssrRenderComponent(_sfc_main$9, mergeProps({
							..._ctx.$attrs,
							...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
							as: __props.as,
							type: __props.type,
							disabled: __props.disabled,
							href,
							navigate,
							rel: rel.value,
							target: rest.target,
							isExternal: rest.isExternal,
							...getPrefetchListeners(rest, _ctx.$attrs)
						}, { class: resolveLinkClass({
							route: linkRoute,
							isActive,
							isExactActive,
							prefetched: rest.prefetched
						}) }), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "default", { active: isLinkActive({
									route: linkRoute,
									isActive,
									isExactActive
								}) }, null, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "default", { active: isLinkActive({
									route: linkRoute,
									isActive,
									isExactActive
								}) })];
							}),
							_: 2
						}, _parent, _scopeId));
					} else return [__props.custom ? (openBlock(), createBlock(unref(Slot), { key: 0 }, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
							..._ctx.$attrs,
							...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
							...rest.prefetched && __props.prefetchedClass ? { class: __props.prefetchedClass } : {},
							...getPrefetchListeners(rest, _ctx.$attrs),
							as: __props.as,
							type: __props.type,
							disabled: __props.disabled,
							href,
							navigate,
							rel: rel.value,
							target: rest.target,
							isExternal: rest.isExternal,
							active: isLinkActive({
								route: linkRoute,
								isActive,
								isExactActive
							})
						})]),
						_: 2
					}, 1024)) : (openBlock(), createBlock(_sfc_main$9, mergeProps({ key: 1 }, {
						..._ctx.$attrs,
						...__props.exact && isExactActive ? { "aria-current": props.ariaCurrentValue } : {},
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						href,
						navigate,
						rel: rel.value,
						target: rest.target,
						isExternal: rest.isExternal,
						...getPrefetchListeners(rest, _ctx.$attrs)
					}, { class: resolveLinkClass({
						route: linkRoute,
						isActive,
						isExactActive,
						prefetched: rest.prefetched
					}) }), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", { active: isLinkActive({
							route: linkRoute,
							isActive,
							isExactActive
						}) })]),
						_: 2
					}, 1040, ["class"]))];
				}),
				_: 3
			}, _parent));
			else if (__props.custom) _push(ssrRenderComponent(unref(Slot), _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", {
						..._ctx.$attrs,
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						...to.value ? {
							href: String(to.value),
							target: props.target,
							rel: rel.value,
							isExternal: true
						} : {},
						active: __props.active ?? false
					}, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", {
						..._ctx.$attrs,
						as: __props.as,
						type: __props.type,
						disabled: __props.disabled,
						...to.value ? {
							href: String(to.value),
							target: props.target,
							rel: rel.value,
							isExternal: true
						} : {},
						active: __props.active ?? false
					})];
				}),
				_: 3
			}, _parent));
			else _push(ssrRenderComponent(_sfc_main$9, mergeProps({
				..._ctx.$attrs,
				as: __props.as,
				type: __props.type,
				disabled: __props.disabled,
				...to.value ? {
					href: String(to.value),
					target: props.target,
					rel: rel.value,
					isExternal: true
				} : {}
			}, { class: resolveLinkClass() }, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) ssrRenderSlot(_ctx.$slots, "default", { active: __props.active ?? false }, null, _push, _parent, _scopeId);
					else return [renderSlot(_ctx.$slots, "default", { active: __props.active ?? false })];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$9 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Link.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fbutton.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbutton_default = {
	"slots": {
		"base": ["rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75", "transition-colors"],
		"label": "truncate",
		"leadingIcon": "shrink-0",
		"leadingAvatar": "shrink-0",
		"leadingAvatarSize": "",
		"trailingIcon": "shrink-0"
	},
	"variants": {
		"fieldGroup": {
			"horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
			"vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
		},
		"color": {
			"primary": "",
			"secondary": "",
			"success": "",
			"info": "",
			"warning": "",
			"error": "",
			"neutral": ""
		},
		"variant": {
			"solid": "",
			"outline": "",
			"soft": "",
			"subtle": "",
			"ghost": "",
			"link": ""
		},
		"size": {
			"xs": {
				"base": "px-2 py-1 text-xs gap-1",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"sm": {
				"base": "px-2.5 py-1.5 text-xs gap-1.5",
				"leadingIcon": "size-4",
				"leadingAvatarSize": "3xs",
				"trailingIcon": "size-4"
			},
			"md": {
				"base": "px-2.5 py-1.5 text-sm gap-1.5",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"lg": {
				"base": "px-3 py-2 text-sm gap-2",
				"leadingIcon": "size-5",
				"leadingAvatarSize": "2xs",
				"trailingIcon": "size-5"
			},
			"xl": {
				"base": "px-3 py-2 text-base gap-2",
				"leadingIcon": "size-6",
				"leadingAvatarSize": "xs",
				"trailingIcon": "size-6"
			}
		},
		"block": { "true": {
			"base": "w-full justify-center",
			"trailingIcon": "ms-auto"
		} },
		"square": { "true": "" },
		"leading": { "true": "" },
		"trailing": { "true": "" },
		"loading": { "true": "" },
		"active": {
			"true": { "base": "" },
			"false": { "base": "" }
		}
	},
	"compoundVariants": [
		{
			"color": "primary",
			"variant": "solid",
			"class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "solid",
			"class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "solid",
			"class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "solid",
			"class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "solid",
			"class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "solid",
			"class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "primary",
			"variant": "outline",
			"class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "outline",
			"class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "outline",
			"class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "outline",
			"class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "outline",
			"class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "outline",
			"class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "soft",
			"class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 outline-primary/25 focus-visible:outline-3 disabled:bg-primary/10 aria-disabled:bg-primary/10"
		},
		{
			"color": "secondary",
			"variant": "soft",
			"class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
		},
		{
			"color": "success",
			"variant": "soft",
			"class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10"
		},
		{
			"color": "info",
			"variant": "soft",
			"class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10"
		},
		{
			"color": "warning",
			"variant": "soft",
			"class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10"
		},
		{
			"color": "error",
			"variant": "soft",
			"class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10"
		},
		{
			"color": "primary",
			"variant": "subtle",
			"class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary"
		},
		{
			"color": "secondary",
			"variant": "subtle",
			"class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary"
		},
		{
			"color": "success",
			"variant": "subtle",
			"class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success"
		},
		{
			"color": "info",
			"variant": "subtle",
			"class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info"
		},
		{
			"color": "warning",
			"variant": "subtle",
			"class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning"
		},
		{
			"color": "error",
			"variant": "subtle",
			"class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error"
		},
		{
			"color": "primary",
			"variant": "ghost",
			"class": "text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "secondary",
			"variant": "ghost",
			"class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "success",
			"variant": "ghost",
			"class": "text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "info",
			"variant": "ghost",
			"class": "text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "warning",
			"variant": "ghost",
			"class": "text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "error",
			"variant": "ghost",
			"class": "text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
		},
		{
			"color": "primary",
			"variant": "link",
			"class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3"
		},
		{
			"color": "secondary",
			"variant": "link",
			"class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary outline-secondary/25 focus-visible:outline-3"
		},
		{
			"color": "success",
			"variant": "link",
			"class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3"
		},
		{
			"color": "info",
			"variant": "link",
			"class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3"
		},
		{
			"color": "warning",
			"variant": "link",
			"class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3"
		},
		{
			"color": "error",
			"variant": "link",
			"class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "solid",
			"class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"color": "neutral",
			"variant": "outline",
			"class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "soft",
			"class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated"
		},
		{
			"color": "neutral",
			"variant": "subtle",
			"class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted"
		},
		{
			"color": "neutral",
			"variant": "ghost",
			"class": "text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
		},
		{
			"color": "neutral",
			"variant": "link",
			"class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3"
		},
		{
			"size": "xs",
			"square": true,
			"class": "p-1"
		},
		{
			"size": "sm",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "md",
			"square": true,
			"class": "p-1.5"
		},
		{
			"size": "lg",
			"square": true,
			"class": "p-2"
		},
		{
			"size": "xl",
			"square": true,
			"class": "p-2"
		},
		{
			"loading": true,
			"leading": true,
			"class": { "leadingIcon": "animate-spin" }
		},
		{
			"loading": true,
			"leading": false,
			"trailing": true,
			"class": { "trailingIcon": "animate-spin" }
		}
	],
	"defaultVariants": {
		"color": "primary",
		"variant": "solid",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Button.vue
var _sfc_main$7 = {
	__name: "UButton",
	__ssrInlineRender: true,
	props: {
		label: {
			type: String,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		activeColor: {
			type: null,
			required: false
		},
		variant: {
			type: null,
			required: false
		},
		activeVariant: {
			type: null,
			required: false
		},
		size: {
			type: null,
			required: false
		},
		square: {
			type: Boolean,
			required: false
		},
		block: {
			type: Boolean,
			required: false
		},
		loadingAuto: {
			type: Boolean,
			required: false
		},
		onClick: {
			type: [Function, Array],
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		leading: {
			type: Boolean,
			required: false
		},
		leadingIcon: {
			type: null,
			required: false
		},
		trailing: {
			type: Boolean,
			required: false
		},
		trailingIcon: {
			type: null,
			required: false
		},
		loading: {
			type: Boolean,
			required: false
		},
		loadingIcon: {
			type: null,
			required: false
		},
		as: {
			type: null,
			required: false
		},
		type: {
			type: null,
			required: false
		},
		disabled: {
			type: Boolean,
			required: false
		},
		active: {
			type: Boolean,
			required: false
		},
		exact: {
			type: Boolean,
			required: false
		},
		exactQuery: {
			type: [Boolean, String],
			required: false
		},
		exactHash: {
			type: Boolean,
			required: false
		},
		inactiveClass: {
			type: String,
			required: false
		},
		locale: {
			type: [Boolean, String],
			required: false
		},
		to: {
			type: null,
			required: false
		},
		href: {
			type: null,
			required: false
		},
		external: {
			type: Boolean,
			required: false
		},
		target: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		rel: {
			type: [
				String,
				Object,
				null
			],
			required: false
		},
		noRel: {
			type: Boolean,
			required: false
		},
		prefetchedClass: {
			type: String,
			required: false
		},
		prefetch: {
			type: Boolean,
			required: false
		},
		prefetchOn: {
			type: [String, Object],
			required: false
		},
		noPrefetch: {
			type: Boolean,
			required: false
		},
		trailingSlash: {
			type: String,
			required: false
		},
		activeClass: {
			type: String,
			required: false
		},
		exactActiveClass: {
			type: String,
			required: false
		},
		ariaCurrentValue: {
			type: String,
			required: false
		},
		viewTransition: {
			type: Boolean,
			required: false
		},
		replace: {
			type: Boolean,
			required: false
		}
	},
	setup(__props) {
		const _props = __props;
		const slots = useSlots();
		const props = useComponentProps("button", _props);
		const appConfig = useAppConfig();
		const { orientation, size: buttonSize } = useFieldGroup(_props);
		const linkProps = useForwardProps(pickLinkProps(props));
		const forwardedLinkProps = computed(() => omit(linkProps.value, [
			"type",
			"disabled",
			"onClick"
		]));
		const loadingAutoState = ref(false);
		const formLoading = inject(formLoadingInjectionKey, void 0);
		async function onClickWrapper(event) {
			loadingAutoState.value = true;
			const callbacks = Array.isArray(props.onClick) ? props.onClick : [props.onClick];
			try {
				await Promise.all(callbacks.map((fn) => fn?.(event)));
			} finally {
				loadingAutoState.value = false;
			}
		}
		const isLoading = computed(() => {
			return props.loading || props.loadingAuto && (loadingAutoState.value || formLoading?.value && props.type === "submit");
		});
		const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(computed(() => ({
			icon: props.icon,
			leading: props.leading,
			leadingIcon: props.leadingIcon,
			trailing: props.trailing,
			trailingIcon: props.trailingIcon,
			loading: isLoading.value,
			loadingIcon: props.loadingIcon
		})));
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fbutton_default,
			...defu({ variants: { active: {
				true: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.true?.base, props.activeClass) },
				false: { base: mergeClasses(appConfig.ui?.button?.variants?.active?.false?.base, props.inactiveClass) }
			} } }, appConfig.ui?.button || {})
		})({
			color: props.color,
			variant: props.variant,
			size: buttonSize.value ?? props.size,
			loading: isLoading.value,
			block: props.block,
			square: props.square || !slots.default && !props.label,
			leading: isLeading.value,
			trailing: isTrailing.value,
			fieldGroup: orientation.value
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(_sfc_main$8, mergeProps({
				type: unref(props).type,
				disabled: unref(props).disabled || isLoading.value
			}, forwardedLinkProps.value, { custom: "" }, _attrs), {
				default: withCtx(({ active, ...slotProps }, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_sfc_main$9, mergeProps({ "data-slot": "base" }, slotProps, {
						class: ui.value.base({
							class: [unref(props).ui?.base, unref(props).class],
							active,
							...active && unref(props).activeVariant ? { variant: unref(props).activeVariant } : {},
							...active && unref(props).activeColor ? { color: unref(props).activeColor } : {}
						}),
						onClick: onClickWrapper
					}), {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
									if (unref(isLeading) && unref(leadingIconName)) _push(ssrRenderComponent(_sfc_main$12, {
										name: unref(leadingIconName),
										"data-slot": "leadingIcon",
										class: ui.value.leadingIcon({
											class: unref(props).ui?.leadingIcon,
											active
										})
									}, null, _parent, _scopeId));
									else if (!!unref(props).avatar) _push(ssrRenderComponent(_sfc_main$10, mergeProps({ size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize() }, unref(props).avatar, {
										"data-slot": "leadingAvatar",
										class: ui.value.leadingAvatar({
											class: unref(props).ui?.leadingAvatar,
											active
										})
									}), null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								ssrRenderSlot(_ctx.$slots, "default", { ui: ui.value }, () => {
									if (unref(props).label !== void 0 && unref(props).label !== null) _push(`<span data-slot="label" class="${ssrRenderClass(ui.value.label({
										class: unref(props).ui?.label,
										active
									}))}"${_scopeId}>${ssrInterpolate(unref(props).label)}</span>`);
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
								ssrRenderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => {
									if (unref(isTrailing) && unref(trailingIconName)) _push(ssrRenderComponent(_sfc_main$12, {
										name: unref(trailingIconName),
										"data-slot": "trailingIcon",
										class: ui.value.trailingIcon({
											class: unref(props).ui?.trailingIcon,
											active
										})
									}, null, _parent, _scopeId));
									else _push(`<!---->`);
								}, _push, _parent, _scopeId);
							} else return [
								renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$12, {
									key: 0,
									name: unref(leadingIconName),
									"data-slot": "leadingIcon",
									class: ui.value.leadingIcon({
										class: unref(props).ui?.leadingIcon,
										active
									})
								}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$10, mergeProps({
									key: 1,
									size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
								}, unref(props).avatar, {
									"data-slot": "leadingAvatar",
									class: ui.value.leadingAvatar({
										class: unref(props).ui?.leadingAvatar,
										active
									})
								}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
								renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
									key: 0,
									"data-slot": "label",
									class: ui.value.label({
										class: unref(props).ui?.label,
										active
									})
								}, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)]),
								renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$12, {
									key: 0,
									name: unref(trailingIconName),
									"data-slot": "trailingIcon",
									class: ui.value.trailingIcon({
										class: unref(props).ui?.trailingIcon,
										active
									})
								}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
							];
						}),
						_: 2
					}, _parent, _scopeId));
					else return [createVNode(_sfc_main$9, mergeProps({ "data-slot": "base" }, slotProps, {
						class: ui.value.base({
							class: [unref(props).ui?.base, unref(props).class],
							active,
							...active && unref(props).activeVariant ? { variant: unref(props).activeVariant } : {},
							...active && unref(props).activeColor ? { color: unref(props).activeColor } : {}
						}),
						onClick: onClickWrapper
					}), {
						default: withCtx(() => [
							renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(isLeading) && unref(leadingIconName) ? (openBlock(), createBlock(_sfc_main$12, {
								key: 0,
								name: unref(leadingIconName),
								"data-slot": "leadingIcon",
								class: ui.value.leadingIcon({
									class: unref(props).ui?.leadingIcon,
									active
								})
							}, null, 8, ["name", "class"])) : !!unref(props).avatar ? (openBlock(), createBlock(_sfc_main$10, mergeProps({
								key: 1,
								size: unref(props).ui?.leadingAvatarSize || ui.value.leadingAvatarSize()
							}, unref(props).avatar, {
								"data-slot": "leadingAvatar",
								class: ui.value.leadingAvatar({
									class: unref(props).ui?.leadingAvatar,
									active
								})
							}), null, 16, ["size", "class"])) : createCommentVNode("", true)]),
							renderSlot(_ctx.$slots, "default", { ui: ui.value }, () => [unref(props).label !== void 0 && unref(props).label !== null ? (openBlock(), createBlock("span", {
								key: 0,
								"data-slot": "label",
								class: ui.value.label({
									class: unref(props).ui?.label,
									active
								})
							}, toDisplayString(unref(props).label), 3)) : createCommentVNode("", true)]),
							renderSlot(_ctx.$slots, "trailing", { ui: ui.value }, () => [unref(isTrailing) && unref(trailingIconName) ? (openBlock(), createBlock(_sfc_main$12, {
								key: 0,
								name: unref(trailingIconName),
								"data-slot": "trailingIcon",
								class: ui.value.trailingIcon({
									class: unref(props).ui?.trailingIcon,
									active
								})
							}, null, 8, ["name", "class"])) : createCommentVNode("", true)])
						]),
						_: 2
					}, 1040, ["class"])];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$8 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Button.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Fprogress.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fprogress_default = {
	"slots": {
		"root": "gap-2",
		"base": "relative overflow-hidden rounded-full bg-accented",
		"indicator": "rounded-full size-full transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:data-[state=indeterminate]:animate-pulse",
		"status": "flex text-dimmed duration-200 ease-out motion-reduce:transition-none",
		"steps": "grid items-end",
		"step": "truncate text-end row-start-1 col-start-1 transition-opacity ease-out"
	},
	"variants": {
		"animation": {
			"carousel": "",
			"carousel-inverse": "",
			"swing": "",
			"elastic": ""
		},
		"color": {
			"primary": {
				"indicator": "bg-primary",
				"steps": "text-primary"
			},
			"secondary": {
				"indicator": "bg-secondary",
				"steps": "text-secondary"
			},
			"success": {
				"indicator": "bg-success",
				"steps": "text-success"
			},
			"info": {
				"indicator": "bg-info",
				"steps": "text-info"
			},
			"warning": {
				"indicator": "bg-warning",
				"steps": "text-warning"
			},
			"error": {
				"indicator": "bg-error",
				"steps": "text-error"
			},
			"neutral": {
				"indicator": "bg-inverted",
				"steps": "text-highlighted"
			}
		},
		"size": {
			"2xs": {
				"status": "text-xs",
				"steps": "text-xs"
			},
			"xs": {
				"status": "text-xs",
				"steps": "text-xs"
			},
			"sm": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"md": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"lg": {
				"status": "text-sm",
				"steps": "text-sm"
			},
			"xl": {
				"status": "text-base",
				"steps": "text-base"
			},
			"2xl": {
				"status": "text-base",
				"steps": "text-base"
			}
		},
		"step": {
			"active": { "step": "opacity-100" },
			"first": { "step": "opacity-100 text-muted" },
			"other": { "step": "opacity-0" },
			"last": { "step": "" }
		},
		"orientation": {
			"horizontal": {
				"root": "w-full flex flex-col",
				"base": "w-full",
				"status": "flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]"
			},
			"vertical": {
				"root": "h-full flex flex-row-reverse",
				"base": "h-full",
				"status": "flex-col justify-end h-(--percent) min-h-fit transition-[height]"
			}
		},
		"inverted": { "true": { "status": "self-end" } }
	},
	"compoundVariants": [
		{
			"inverted": true,
			"orientation": "horizontal",
			"class": {
				"step": "text-start",
				"status": "flex-row-reverse"
			}
		},
		{
			"inverted": true,
			"orientation": "vertical",
			"class": {
				"steps": "items-start",
				"status": "flex-col-reverse"
			}
		},
		{
			"orientation": "horizontal",
			"size": "2xs",
			"class": "h-px"
		},
		{
			"orientation": "horizontal",
			"size": "xs",
			"class": "h-0.5"
		},
		{
			"orientation": "horizontal",
			"size": "sm",
			"class": "h-1"
		},
		{
			"orientation": "horizontal",
			"size": "md",
			"class": "h-2"
		},
		{
			"orientation": "horizontal",
			"size": "lg",
			"class": "h-3"
		},
		{
			"orientation": "horizontal",
			"size": "xl",
			"class": "h-4"
		},
		{
			"orientation": "horizontal",
			"size": "2xl",
			"class": "h-5"
		},
		{
			"orientation": "vertical",
			"size": "2xs",
			"class": "w-px"
		},
		{
			"orientation": "vertical",
			"size": "xs",
			"class": "w-0.5"
		},
		{
			"orientation": "vertical",
			"size": "sm",
			"class": "w-1"
		},
		{
			"orientation": "vertical",
			"size": "md",
			"class": "w-2"
		},
		{
			"orientation": "vertical",
			"size": "lg",
			"class": "w-3"
		},
		{
			"orientation": "vertical",
			"size": "xl",
			"class": "w-4"
		},
		{
			"orientation": "vertical",
			"size": "2xl",
			"class": "w-5"
		},
		{
			"orientation": "horizontal",
			"animation": "carousel",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_linear_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "carousel",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-vertical_2s_linear_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "carousel-inverse",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-inverse_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_linear_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "carousel-inverse",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_linear_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "swing",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[swing_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "swing",
			"class": { "indicator": "motion-safe:data-[state=indeterminate]:animate-[swing-vertical_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "horizontal",
			"animation": "elastic",
			"class": { "indicator": "relative motion-safe:data-[state=indeterminate]:animate-[elastic_2s_var(--ease-in-out)_infinite]" }
		},
		{
			"orientation": "vertical",
			"animation": "elastic",
			"class": { "indicator": "relative motion-safe:data-[state=indeterminate]:animate-[elastic-vertical_2s_var(--ease-in-out)_infinite]" }
		}
	],
	"defaultVariants": {
		"animation": "carousel",
		"color": "primary",
		"size": "md"
	}
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue
var _sfc_main$6 = {
	__name: "UProgress",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		max: {
			type: [Number, Array],
			required: false
		},
		status: {
			type: Boolean,
			required: false
		},
		inverted: {
			type: Boolean,
			required: false,
			default: false
		},
		size: {
			type: null,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		orientation: {
			type: null,
			required: false,
			default: "horizontal"
		},
		animation: {
			type: null,
			required: false
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		getValueLabel: {
			type: Function,
			required: false
		},
		getValueText: {
			type: Function,
			required: false
		},
		modelValue: {
			type: [Number, null],
			required: false,
			default: null
		}
	},
	emits: ["update:modelValue", "update:max"],
	setup(__props, { emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("progress", _props);
		const { dir } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "getValueLabel", "getValueText", "modelValue"), emits);
		const isIndeterminate = computed(() => rootProps.value.modelValue === null);
		const hasSteps = computed(() => Array.isArray(props.max));
		const realMax = computed(() => {
			if (isIndeterminate.value || !props.max) return;
			if (Array.isArray(props.max)) return props.max.length - 1;
			return Number(props.max);
		});
		const percent = computed(() => {
			if (isIndeterminate.value) return;
			switch (true) {
				case rootProps.value.modelValue < 0: return 0;
				case rootProps.value.modelValue > (realMax.value ?? 100): return 100;
				default: return Math.round(rootProps.value.modelValue / (realMax.value ?? 100) * 100);
			}
		});
		const indicatorStyle = computed(() => {
			if (percent.value === void 0) return;
			if (props.orientation === "vertical") return { transform: `translateY(${props.inverted ? "" : "-"}${100 - percent.value}%)` };
			else if (dir.value === "rtl") return { transform: `translateX(${props.inverted ? "-" : ""}${100 - percent.value}%)` };
			else return { transform: `translateX(${props.inverted ? "" : "-"}${100 - percent.value}%)` };
		});
		const statusStyle = computed(() => ({ "--percent": `${Math.max(percent.value ?? 0, 0)}%` }));
		function isActive(index) {
			return index === Number(props.modelValue);
		}
		function isFirst(index) {
			return index === 0;
		}
		function isLast(index) {
			return index === realMax.value;
		}
		function stepVariant(index) {
			index = Number(index);
			if (isActive(index) && !isFirst(index)) return "active";
			if (isFirst(index) && isActive(index)) return "first";
			if (isLast(index) && isActive(index)) return "last";
			return "other";
		}
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fprogress_default,
			...appConfig.ui?.progress || {}
		})({
			animation: props.animation,
			size: props.size,
			color: props.color,
			orientation: props.orientation,
			inverted: props.inverted
		}));
		const themeColors = computed(() => Object.keys({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Fprogress_default.variants?.color,
			...appConfig.ui?.progress?.variants?.color
		}));
		const customColor = computed(() => props.color && !themeColors.value.includes(props.color) ? props.color : void 0);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(Primitive), mergeProps({
				as: unref(props).as,
				"data-orientation": unref(props).orientation,
				"data-slot": "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] })
			}, _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						if (!isIndeterminate.value && (unref(props).status || !!slots.status)) {
							_push(`<div data-slot="status" class="${ssrRenderClass(ui.value.status({ class: unref(props).ui?.status }))}" style="${ssrRenderStyle(statusStyle.value)}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "status", { percent: percent.value }, () => {
								_push(`${ssrInterpolate(percent.value)}% `);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(ssrRenderComponent(unref(ProgressRoot_default), mergeProps(unref(rootProps), {
							max: realMax.value,
							"data-slot": "base",
							class: ui.value.base({ class: unref(props).ui?.base }),
							style: { "transform": "translateZ(0)" }
						}), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(ProgressIndicator_default), {
									"data-slot": "indicator",
									class: ui.value.indicator({ class: unref(props).ui?.indicator }),
									style: [indicatorStyle.value, customColor.value ? { backgroundColor: customColor.value } : void 0]
								}, null, _parent, _scopeId));
								else return [createVNode(unref(ProgressIndicator_default), {
									"data-slot": "indicator",
									class: ui.value.indicator({ class: unref(props).ui?.indicator }),
									style: [indicatorStyle.value, customColor.value ? { backgroundColor: customColor.value } : void 0]
								}, null, 8, ["class", "style"])];
							}),
							_: 1
						}, _parent, _scopeId));
						if (hasSteps.value) {
							_push(`<div data-slot="steps" class="${ssrRenderClass(ui.value.steps({ class: unref(props).ui?.steps }))}" style="${ssrRenderStyle(customColor.value ? { color: customColor.value } : void 0)}"${_scopeId}><!--[-->`);
							ssrRenderList(unref(props).max, (step, index) => {
								_push(`<div data-slot="step" class="${ssrRenderClass(ui.value.step({
									class: unref(props).ui?.step,
									step: stepVariant(index)
								}))}"${_scopeId}>`);
								ssrRenderSlot(_ctx.$slots, `step-${index}`, { step }, () => {
									_push(`${ssrInterpolate(step)}`);
								}, _push, _parent, _scopeId);
								_push(`</div>`);
							});
							_push(`<!--]--></div>`);
						} else _push(`<!---->`);
					} else return [
						!isIndeterminate.value && (unref(props).status || !!slots.status) ? (openBlock(), createBlock("div", {
							key: 0,
							"data-slot": "status",
							class: ui.value.status({ class: unref(props).ui?.status }),
							style: statusStyle.value
						}, [renderSlot(_ctx.$slots, "status", { percent: percent.value }, () => [createTextVNode(toDisplayString(percent.value) + "% ", 1)])], 6)) : createCommentVNode("", true),
						createVNode(unref(ProgressRoot_default), mergeProps(unref(rootProps), {
							max: realMax.value,
							"data-slot": "base",
							class: ui.value.base({ class: unref(props).ui?.base }),
							style: { "transform": "translateZ(0)" }
						}), {
							default: withCtx(() => [createVNode(unref(ProgressIndicator_default), {
								"data-slot": "indicator",
								class: ui.value.indicator({ class: unref(props).ui?.indicator }),
								style: [indicatorStyle.value, customColor.value ? { backgroundColor: customColor.value } : void 0]
							}, null, 8, ["class", "style"])]),
							_: 1
						}, 16, ["max", "class"]),
						hasSteps.value ? (openBlock(), createBlock("div", {
							key: 1,
							"data-slot": "steps",
							class: ui.value.steps({ class: unref(props).ui?.steps }),
							style: customColor.value ? { color: customColor.value } : void 0
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(props).max, (step, index) => {
							return openBlock(), createBlock("div", {
								key: index,
								"data-slot": "step",
								class: ui.value.step({
									class: unref(props).ui?.step,
									step: stepVariant(index)
								})
							}, [renderSlot(_ctx.$slots, `step-${index}`, { step }, () => [createTextVNode(toDisplayString(step), 1)])], 2);
						}), 128))], 6)) : createCommentVNode("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$7 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Progress.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftoast.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftoast_default = {
	"slots": {
		"root": "relative group overflow-hidden bg-default shadow-lg rounded-lg ring ring-default p-4 flex gap-2.5",
		"wrapper": "w-0 flex-1 flex flex-col",
		"title": "text-sm font-medium text-highlighted",
		"description": "text-sm text-muted",
		"icon": "shrink-0 size-5",
		"avatar": "shrink-0",
		"avatarSize": "2xl",
		"actions": "flex gap-1.5 shrink-0",
		"progress": "absolute inset-x-0 bottom-0",
		"close": "p-0"
	},
	"variants": {
		"color": {
			"primary": {
				"root": "outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary",
				"icon": "text-primary"
			},
			"secondary": {
				"root": "outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary",
				"icon": "text-secondary"
			},
			"success": {
				"root": "outline-success/25 focus-visible:outline-3 focus-visible:ring-success",
				"icon": "text-success"
			},
			"info": {
				"root": "outline-info/25 focus-visible:outline-3 focus-visible:ring-info",
				"icon": "text-info"
			},
			"warning": {
				"root": "outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning",
				"icon": "text-warning"
			},
			"error": {
				"root": "outline-error/25 focus-visible:outline-3 focus-visible:ring-error",
				"icon": "text-error"
			},
			"neutral": {
				"root": "outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted",
				"icon": "text-highlighted"
			}
		},
		"orientation": {
			"horizontal": {
				"root": "items-center",
				"actions": "items-center"
			},
			"vertical": {
				"root": "items-start",
				"actions": "items-start mt-2.5"
			}
		},
		"title": { "true": { "description": "mt-1" } }
	},
	"defaultVariants": { "color": "primary" }
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue
var _sfc_main$5 = {
	__name: "UToast",
	__ssrInlineRender: true,
	props: {
		as: {
			type: null,
			required: false
		},
		title: {
			type: [
				String,
				Object,
				Function
			],
			required: false
		},
		description: {
			type: [
				String,
				Object,
				Function
			],
			required: false
		},
		icon: {
			type: null,
			required: false
		},
		avatar: {
			type: Object,
			required: false
		},
		color: {
			type: null,
			required: false
		},
		orientation: {
			type: null,
			required: false,
			default: "vertical"
		},
		close: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		closeIcon: {
			type: null,
			required: false
		},
		actions: {
			type: Array,
			required: false
		},
		duration: {
			type: Number,
			required: false
		},
		progress: {
			type: [Boolean, Object],
			required: false,
			default: true
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		defaultOpen: {
			type: Boolean,
			required: false
		},
		open: {
			type: Boolean,
			required: false
		},
		type: {
			type: String,
			required: false
		}
	},
	emits: [
		"escapeKeyDown",
		"pause",
		"resume",
		"swipeStart",
		"swipeMove",
		"swipeCancel",
		"swipeEnd",
		"update:open"
	],
	setup(__props, { expose: __expose, emit: __emit }) {
		const _props = __props;
		const emits = __emit;
		const slots = useSlots();
		const props = useComponentProps("toast", _props);
		const { t } = useLocale();
		const appConfig = useAppConfig();
		const rootProps = useForwardProps(reactivePick(props, "as", "defaultOpen", "open", "duration", "type"), emits);
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftoast_default,
			...appConfig.ui?.toast || {}
		})({
			color: props.color,
			orientation: props.orientation,
			title: !!props.title || !!slots.title
		}));
		const rootRef = useTemplateRef("rootRef");
		const height = ref(0);
		__expose({ height });
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ToastRoot_default), mergeProps({
				ref_key: "rootRef",
				ref: rootRef
			}, unref(rootProps), {
				"data-orientation": unref(props).orientation,
				"data-slot": "root",
				class: ui.value.root({ class: [unref(props).ui?.root, unref(props).class] }),
				style: { "--height": height.value }
			}, _attrs), {
				default: withCtx(({ remaining, duration: totalDuration, open }, _push, _parent, _scopeId) => {
					if (_push) {
						ssrRenderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => {
							if (unref(props).avatar) _push(ssrRenderComponent(_sfc_main$10, mergeProps({ size: unref(props).ui?.avatarSize || ui.value.avatarSize() }, unref(props).avatar, {
								"data-slot": "avatar",
								class: ui.value.avatar({ class: unref(props).ui?.avatar })
							}), null, _parent, _scopeId));
							else if (unref(props).icon) _push(ssrRenderComponent(_sfc_main$12, {
								name: unref(props).icon,
								"data-slot": "icon",
								class: ui.value.icon({ class: unref(props).ui?.icon })
							}, null, _parent, _scopeId));
							else _push(`<!---->`);
						}, _push, _parent, _scopeId);
						_push(`<div data-slot="wrapper" class="${ssrRenderClass(ui.value.wrapper({ class: unref(props).ui?.wrapper }))}"${_scopeId}>`);
						if (unref(props).title || !!slots.title) _push(ssrRenderComponent(unref(ToastTitle_default), {
							"data-slot": "title",
							class: ui.value.title({ class: unref(props).ui?.title })
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "title", {}, () => {
									if (typeof unref(props).title === "function") ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).title()), null, null), _parent, _scopeId);
									else if (typeof unref(props).title === "object") ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).title), null, null), _parent, _scopeId);
									else _push(`<!--[-->${ssrInterpolate(unref(props).title)}<!--]-->`);
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "title", {}, () => [typeof unref(props).title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).title()), { key: 0 })) : typeof unref(props).title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString(unref(props).title), 1)], 64))])];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(props).description || !!slots.description) _push(ssrRenderComponent(unref(ToastDescription_default), {
							"data-slot": "description",
							class: ui.value.description({ class: unref(props).ui?.description })
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) ssrRenderSlot(_ctx.$slots, "description", {}, () => {
									if (typeof unref(props).description === "function") ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).description()), null, null), _parent, _scopeId);
									else if (typeof unref(props).description === "object") ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(props).description), null, null), _parent, _scopeId);
									else _push(`<!--[-->${ssrInterpolate(unref(props).description)}<!--]-->`);
								}, _push, _parent, _scopeId);
								else return [renderSlot(_ctx.$slots, "description", {}, () => [typeof unref(props).description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).description()), { key: 0 })) : typeof unref(props).description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString(unref(props).description), 1)], 64))])];
							}),
							_: 2
						}, _parent, _scopeId));
						else _push(`<!---->`);
						if (unref(props).orientation === "vertical" && (unref(props).actions?.length || !!slots.actions)) {
							_push(`<div data-slot="actions" class="${ssrRenderClass(ui.value.actions({ class: unref(props).ui?.actions }))}"${_scopeId}>`);
							ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
								_push(`<!--[-->`);
								ssrRenderList(unref(props).actions, (action, index) => {
									_push(ssrRenderComponent(unref(ToastAction_default), {
										key: index,
										"alt-text": action.label || "Action",
										"as-child": "",
										onClick: () => {}
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_sfc_main$7, mergeProps({
												size: "xs",
												color: unref(props).color
											}, { ref_for: true }, action), null, _parent, _scopeId));
											else return [createVNode(_sfc_main$7, mergeProps({
												size: "xs",
												color: unref(props).color
											}, { ref_for: true }, action), null, 16, ["color"])];
										}),
										_: 2
									}, _parent, _scopeId));
								});
								_push(`<!--]-->`);
							}, _push, _parent, _scopeId);
							_push(`</div>`);
						} else _push(`<!---->`);
						_push(`</div>`);
						if (unref(props).orientation === "horizontal" && (unref(props).actions?.length || !!slots.actions) || unref(props).close) {
							_push(`<div data-slot="actions" class="${ssrRenderClass(ui.value.actions({
								class: unref(props).ui?.actions,
								orientation: "horizontal"
							}))}"${_scopeId}>`);
							if (unref(props).orientation === "horizontal" && (unref(props).actions?.length || !!slots.actions)) ssrRenderSlot(_ctx.$slots, "actions", {}, () => {
								_push(`<!--[-->`);
								ssrRenderList(unref(props).actions, (action, index) => {
									_push(ssrRenderComponent(unref(ToastAction_default), {
										key: index,
										"alt-text": action.label || "Action",
										"as-child": "",
										onClick: () => {}
									}, {
										default: withCtx((_, _push, _parent, _scopeId) => {
											if (_push) _push(ssrRenderComponent(_sfc_main$7, mergeProps({
												size: "xs",
												color: unref(props).color
											}, { ref_for: true }, action), null, _parent, _scopeId));
											else return [createVNode(_sfc_main$7, mergeProps({
												size: "xs",
												color: unref(props).color
											}, { ref_for: true }, action), null, 16, ["color"])];
										}),
										_: 2
									}, _parent, _scopeId));
								});
								_push(`<!--]-->`);
							}, _push, _parent, _scopeId);
							else _push(`<!---->`);
							if (unref(props).close || !!slots.close) _push(ssrRenderComponent(unref(ToastClose_default), { "as-child": "" }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) ssrRenderSlot(_ctx.$slots, "close", { ui: ui.value }, () => {
										if (unref(props).close) _push(ssrRenderComponent(_sfc_main$7, mergeProps({
											icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
											color: "neutral",
											variant: "link",
											"aria-label": unref(t)("toast.close")
										}, typeof unref(props).close === "object" ? unref(props).close : {}, {
											"data-slot": "close",
											class: ui.value.close({ class: unref(props).ui?.close }),
											onClick: () => {}
										}), null, _parent, _scopeId));
										else _push(`<!---->`);
									}, _push, _parent, _scopeId);
									else return [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [unref(props).close ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
										key: 0,
										icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
										color: "neutral",
										variant: "link",
										"aria-label": unref(t)("toast.close")
									}, typeof unref(props).close === "object" ? unref(props).close : {}, {
										"data-slot": "close",
										class: ui.value.close({ class: unref(props).ui?.close }),
										onClick: withModifiers(() => {}, ["stop"])
									}), null, 16, [
										"icon",
										"aria-label",
										"class",
										"onClick"
									])) : createCommentVNode("", true)])];
								}),
								_: 2
							}, _parent, _scopeId));
							else _push(`<!---->`);
							_push(`</div>`);
						} else _push(`<!---->`);
						if (unref(props).progress && open && remaining > 0 && totalDuration) _push(ssrRenderComponent(_sfc_main$6, mergeProps({
							"model-value": remaining / totalDuration * 100,
							color: unref(props).color
						}, typeof unref(props).progress === "object" ? unref(props).progress : {}, {
							size: "sm",
							"data-slot": "progress",
							class: ui.value.progress({ class: unref(props).ui?.progress })
						}), null, _parent, _scopeId));
						else _push(`<!---->`);
					} else return [
						renderSlot(_ctx.$slots, "leading", { ui: ui.value }, () => [unref(props).avatar ? (openBlock(), createBlock(_sfc_main$10, mergeProps({
							key: 0,
							size: unref(props).ui?.avatarSize || ui.value.avatarSize()
						}, unref(props).avatar, {
							"data-slot": "avatar",
							class: ui.value.avatar({ class: unref(props).ui?.avatar })
						}), null, 16, ["size", "class"])) : unref(props).icon ? (openBlock(), createBlock(_sfc_main$12, {
							key: 1,
							name: unref(props).icon,
							"data-slot": "icon",
							class: ui.value.icon({ class: unref(props).ui?.icon })
						}, null, 8, ["name", "class"])) : createCommentVNode("", true)]),
						createVNode("div", {
							"data-slot": "wrapper",
							class: ui.value.wrapper({ class: unref(props).ui?.wrapper })
						}, [
							unref(props).title || !!slots.title ? (openBlock(), createBlock(unref(ToastTitle_default), {
								key: 0,
								"data-slot": "title",
								class: ui.value.title({ class: unref(props).ui?.title })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "title", {}, () => [typeof unref(props).title === "function" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).title()), { key: 0 })) : typeof unref(props).title === "object" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).title), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString(unref(props).title), 1)], 64))])]),
								_: 3
							}, 8, ["class"])) : createCommentVNode("", true),
							unref(props).description || !!slots.description ? (openBlock(), createBlock(unref(ToastDescription_default), {
								key: 1,
								"data-slot": "description",
								class: ui.value.description({ class: unref(props).ui?.description })
							}, {
								default: withCtx(() => [renderSlot(_ctx.$slots, "description", {}, () => [typeof unref(props).description === "function" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).description()), { key: 0 })) : typeof unref(props).description === "object" ? (openBlock(), createBlock(resolveDynamicComponent(unref(props).description), { key: 1 })) : (openBlock(), createBlock(Fragment, { key: 2 }, [createTextVNode(toDisplayString(unref(props).description), 1)], 64))])]),
								_: 3
							}, 8, ["class"])) : createCommentVNode("", true),
							unref(props).orientation === "vertical" && (unref(props).actions?.length || !!slots.actions) ? (openBlock(), createBlock("div", {
								key: 2,
								"data-slot": "actions",
								class: ui.value.actions({ class: unref(props).ui?.actions })
							}, [renderSlot(_ctx.$slots, "actions", {}, () => [(openBlock(true), createBlock(Fragment, null, renderList(unref(props).actions, (action, index) => {
								return openBlock(), createBlock(unref(ToastAction_default), {
									key: index,
									"alt-text": action.label || "Action",
									"as-child": "",
									onClick: withModifiers(() => {}, ["stop"])
								}, {
									default: withCtx(() => [createVNode(_sfc_main$7, mergeProps({
										size: "xs",
										color: unref(props).color
									}, { ref_for: true }, action), null, 16, ["color"])]),
									_: 2
								}, 1032, ["alt-text", "onClick"]);
							}), 128))])], 2)) : createCommentVNode("", true)
						], 2),
						unref(props).orientation === "horizontal" && (unref(props).actions?.length || !!slots.actions) || unref(props).close ? (openBlock(), createBlock("div", {
							key: 0,
							"data-slot": "actions",
							class: ui.value.actions({
								class: unref(props).ui?.actions,
								orientation: "horizontal"
							})
						}, [unref(props).orientation === "horizontal" && (unref(props).actions?.length || !!slots.actions) ? renderSlot(_ctx.$slots, "actions", {}, () => [(openBlock(true), createBlock(Fragment, null, renderList(unref(props).actions, (action, index) => {
							return openBlock(), createBlock(unref(ToastAction_default), {
								key: index,
								"alt-text": action.label || "Action",
								"as-child": "",
								onClick: withModifiers(() => {}, ["stop"])
							}, {
								default: withCtx(() => [createVNode(_sfc_main$7, mergeProps({
									size: "xs",
									color: unref(props).color
								}, { ref_for: true }, action), null, 16, ["color"])]),
								_: 2
							}, 1032, ["alt-text", "onClick"]);
						}), 128))], void 0, 0) : createCommentVNode("", true), unref(props).close || !!slots.close ? (openBlock(), createBlock(unref(ToastClose_default), {
							key: 1,
							"as-child": ""
						}, {
							default: withCtx(() => [renderSlot(_ctx.$slots, "close", { ui: ui.value }, () => [unref(props).close ? (openBlock(), createBlock(_sfc_main$7, mergeProps({
								key: 0,
								icon: unref(props).closeIcon || unref(appConfig).ui.icons.close,
								color: "neutral",
								variant: "link",
								"aria-label": unref(t)("toast.close")
							}, typeof unref(props).close === "object" ? unref(props).close : {}, {
								"data-slot": "close",
								class: ui.value.close({ class: unref(props).ui?.close }),
								onClick: withModifiers(() => {}, ["stop"])
							}), null, 16, [
								"icon",
								"aria-label",
								"class",
								"onClick"
							])) : createCommentVNode("", true)])]),
							_: 3
						})) : createCommentVNode("", true)], 2)) : createCommentVNode("", true),
						unref(props).progress && open && remaining > 0 && totalDuration ? (openBlock(), createBlock(_sfc_main$6, mergeProps({
							key: 1,
							"model-value": remaining / totalDuration * 100,
							color: unref(props).color
						}, typeof unref(props).progress === "object" ? unref(props).progress : {}, {
							size: "sm",
							"data-slot": "progress",
							class: ui.value.progress({ class: unref(props).ui?.progress })
						}), null, 16, [
							"model-value",
							"color",
							"class"
						])) : createCommentVNode("", true)
					];
				}),
				_: 3
			}, _parent));
		};
	}
};
var _sfc_setup$6 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Toast.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fui%2Ftoaster.ts
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftoaster_default = {
	"slots": {
		"viewport": "fixed flex flex-col w-[calc(100%-2rem)] sm:w-96 z-[100] data-[expanded=true]:h-(--height) focus:outline-none",
		"base": "pointer-events-auto absolute inset-x-0 z-(--index) transform-(--transform) data-[expanded=false]:data-[front=false]:h-(--front-height) data-[expanded=false]:data-[front=false]:*:opacity-0 data-[front=false]:*:transition-opacity data-[front=false]:*:duration-100 data-[state=closed]:animate-[toast-closed_200ms_var(--ease-out)] data-[state=closed]:data-[expanded=false]:data-[front=false]:animate-[toast-collapsed-closed_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=odd]:animate-[toast-pulse-a_200ms_var(--ease-out)] motion-safe:data-[state=open]:data-[pulsing=even]:animate-[toast-pulse-b_200ms_var(--ease-out)] data-[swipe=move]:transition-none transition-[transform,translate,height] duration-200 ease-out motion-reduce:transition-none"
	},
	"variants": {
		"position": {
			"top-left": { "viewport": "left-4" },
			"top-center": { "viewport": "left-1/2 transform -translate-x-1/2" },
			"top-right": { "viewport": "right-4" },
			"bottom-left": { "viewport": "left-4" },
			"bottom-center": { "viewport": "left-1/2 transform -translate-x-1/2" },
			"bottom-right": { "viewport": "right-4" }
		},
		"swipeDirection": {
			"up": "data-[swipe=end]:animate-[toast-slide-up_200ms_var(--ease-out)]",
			"right": "data-[swipe=end]:animate-[toast-slide-right_200ms_var(--ease-out)]",
			"down": "data-[swipe=end]:animate-[toast-slide-down_200ms_var(--ease-out)]",
			"left": "data-[swipe=end]:animate-[toast-slide-left_200ms_var(--ease-out)]"
		}
	},
	"compoundVariants": [
		{
			"position": [
				"top-left",
				"top-center",
				"top-right"
			],
			"class": {
				"viewport": "top-4",
				"base": "top-0 data-[state=open]:animate-[toast-slide-in-from-top_200ms_var(--ease-out)]"
			}
		},
		{
			"position": [
				"bottom-left",
				"bottom-center",
				"bottom-right"
			],
			"class": {
				"viewport": "bottom-4",
				"base": "bottom-0 data-[state=open]:animate-[toast-slide-in-from-bottom_200ms_var(--ease-out)]"
			}
		},
		{
			"swipeDirection": ["left", "right"],
			"class": "data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x) data-[swipe=end]:translate-x-(--reka-toast-swipe-end-x) data-[swipe=cancel]:translate-x-0"
		},
		{
			"swipeDirection": ["up", "down"],
			"class": "data-[swipe=move]:translate-y-(--reka-toast-swipe-move-y) data-[swipe=end]:translate-y-(--reka-toast-swipe-end-y) data-[swipe=cancel]:translate-y-0"
		}
	],
	"defaultVariants": { "position": "bottom-right" }
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue
var _sfc_main$4 = /*@__PURE__*/ Object.assign({ name: "Toaster" }, {
	__ssrInlineRender: true,
	props: {
		position: {
			type: null,
			required: false
		},
		expand: {
			type: Boolean,
			required: false,
			default: true
		},
		progress: {
			type: Boolean,
			required: false,
			default: true
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: true
		},
		max: {
			type: Number,
			required: false,
			default: 5
		},
		class: {
			type: null,
			required: false
		},
		ui: {
			type: Object,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		duration: {
			type: Number,
			required: false,
			default: 5e3
		},
		disableSwipe: {
			type: Boolean,
			required: false
		},
		swipeThreshold: {
			type: Number,
			required: false
		}
	},
	setup(__props) {
		const props = useComponentProps("toaster", __props);
		const { toasts, remove } = useToast();
		const appConfig = useAppConfig();
		provide(toastMaxInjectionKey, toRef(() => props.max));
		const providerProps = useForwardProps(reactivePick(props, "duration", "label", "swipeThreshold", "disableSwipe"));
		const portalProps = usePortal(toRef(() => props.portal));
		const swipeDirection = computed(() => {
			switch (props.position) {
				case "top-center": return "up";
				case "top-right":
				case "bottom-right": return "right";
				case "bottom-center": return "down";
				case "top-left":
				case "bottom-left": return "left";
			}
			return "right";
		});
		const ui = computed(() => tv({
			extend: virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fui_2Ftoaster_default,
			...appConfig.ui?.toaster || {}
		})({
			position: props.position,
			swipeDirection: swipeDirection.value
		}));
		function onUpdateOpen(value, id) {
			if (value) return;
			remove(id);
		}
		const hovered = ref(false);
		const expanded = computed(() => props.expand || hovered.value);
		const refs = ref([]);
		const height = computed(() => refs.value.reduce((acc, { height: height2 }) => acc + height2 + 16, 0));
		const frontHeight = computed(() => refs.value[refs.value.length - 1]?.height || 0);
		function getOffset(index) {
			return refs.value.slice(index + 1).reduce((acc, { height: height2 }) => acc + height2 + 16, 0);
		}
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ToastProvider_default), mergeProps({ "swipe-direction": swipeDirection.value }, unref(providerProps), _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
						_push(`<!--[-->`);
						ssrRenderList(unref(toasts), (toast, index) => {
							_push(ssrRenderComponent(_sfc_main$5, mergeProps({
								key: toast.id,
								ref_for: true,
								ref_key: "refs",
								ref: refs,
								progress: unref(props).progress
							}, { ref_for: true }, unref(omit)(toast, [
								"id",
								"close",
								"_duplicate",
								"_updated",
								"onClick"
							]), {
								close: toast.close,
								"data-expanded": expanded.value,
								"data-front": !expanded.value && index === unref(toasts).length - 1,
								"data-pulsing": toast._duplicate ? toast._duplicate % 2 === 0 ? "even" : "odd" : void 0,
								style: {
									"--index": index - unref(toasts).length + unref(toasts).length,
									"--before": unref(toasts).length - 1 - index,
									"--offset": getOffset(index),
									"--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
									"--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
									"--transform": "translateY(var(--translate)) scale(var(--scale))"
								},
								"data-slot": "base",
								class: ui.value.base({ class: [unref(props).ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
								"onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
								onClick: ($event) => toast.onClick && toast.onClick(toast)
							}), null, _parent, _scopeId));
						});
						_push(`<!--]-->`);
						_push(ssrRenderComponent(unref(ToastPortal_default), unref(portalProps), {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(ssrRenderComponent(unref(ToastViewport_default), {
									"data-expanded": expanded.value,
									"data-slot": "viewport",
									class: ui.value.viewport({ class: [unref(props).ui?.viewport, unref(props).class] }),
									style: {
										"--scale-factor": "0.05",
										"--translate-factor": unref(props).position?.startsWith("top") ? "1px" : "-1px",
										"--gap": unref(props).position?.startsWith("top") ? "16px" : "-16px",
										"--front-height": `${frontHeight.value}px`,
										"--height": `${height.value}px`
									},
									onMouseenter: ($event) => hovered.value = true,
									onMouseleave: ($event) => hovered.value = false
								}, null, _parent, _scopeId));
								else return [createVNode(unref(ToastViewport_default), {
									"data-expanded": expanded.value,
									"data-slot": "viewport",
									class: ui.value.viewport({ class: [unref(props).ui?.viewport, unref(props).class] }),
									style: {
										"--scale-factor": "0.05",
										"--translate-factor": unref(props).position?.startsWith("top") ? "1px" : "-1px",
										"--gap": unref(props).position?.startsWith("top") ? "16px" : "-16px",
										"--front-height": `${frontHeight.value}px`,
										"--height": `${height.value}px`
									},
									onMouseenter: ($event) => hovered.value = true,
									onMouseleave: ($event) => hovered.value = false
								}, null, 8, [
									"data-expanded",
									"class",
									"style",
									"onMouseenter",
									"onMouseleave"
								])];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [
						renderSlot(_ctx.$slots, "default"),
						(openBlock(true), createBlock(Fragment, null, renderList(unref(toasts), (toast, index) => {
							return openBlock(), createBlock(_sfc_main$5, mergeProps({
								key: toast.id,
								ref_for: true,
								ref_key: "refs",
								ref: refs,
								progress: unref(props).progress
							}, { ref_for: true }, unref(omit)(toast, [
								"id",
								"close",
								"_duplicate",
								"_updated",
								"onClick"
							]), {
								close: toast.close,
								"data-expanded": expanded.value,
								"data-front": !expanded.value && index === unref(toasts).length - 1,
								"data-pulsing": toast._duplicate ? toast._duplicate % 2 === 0 ? "even" : "odd" : void 0,
								style: {
									"--index": index - unref(toasts).length + unref(toasts).length,
									"--before": unref(toasts).length - 1 - index,
									"--offset": getOffset(index),
									"--scale": expanded.value ? "1" : "calc(1 - var(--before) * var(--scale-factor))",
									"--translate": expanded.value ? "calc(var(--offset) * var(--translate-factor))" : "calc(var(--before) * var(--gap))",
									"--transform": "translateY(var(--translate)) scale(var(--scale))"
								},
								"data-slot": "base",
								class: ui.value.base({ class: [unref(props).ui?.base, toast.onClick ? "cursor-pointer" : void 0] }),
								"onUpdate:open": ($event) => onUpdateOpen($event, toast.id),
								onClick: ($event) => toast.onClick && toast.onClick(toast)
							}), null, 16, [
								"progress",
								"close",
								"data-expanded",
								"data-front",
								"data-pulsing",
								"style",
								"class",
								"onUpdate:open",
								"onClick"
							]);
						}), 128)),
						createVNode(unref(ToastPortal_default), unref(portalProps), {
							default: withCtx(() => [createVNode(unref(ToastViewport_default), {
								"data-expanded": expanded.value,
								"data-slot": "viewport",
								class: ui.value.viewport({ class: [unref(props).ui?.viewport, unref(props).class] }),
								style: {
									"--scale-factor": "0.05",
									"--translate-factor": unref(props).position?.startsWith("top") ? "1px" : "-1px",
									"--gap": unref(props).position?.startsWith("top") ? "16px" : "-16px",
									"--front-height": `${frontHeight.value}px`,
									"--height": `${height.value}px`
								},
								onMouseenter: ($event) => hovered.value = true,
								onMouseleave: ($event) => hovered.value = false
							}, null, 8, [
								"data-expanded",
								"class",
								"style",
								"onMouseenter",
								"onMouseleave"
							])]),
							_: 1
						}, 16)
					];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$5 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/Toaster.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var Toaster_default = Object.assign(_sfc_main$4, { __name: "UToaster" });
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/composables/useOverlay.js
function _useOverlay() {
	const overlays = shallowReactive([]);
	const create = (component, _options) => {
		const { props, defaultOpen, destroyOnClose } = _options || {};
		const options = reactive({
			id: Symbol(""),
			isOpen: !!defaultOpen,
			component: markRaw(component),
			isMounted: !!defaultOpen,
			destroyOnClose: !!destroyOnClose,
			originalProps: props || {},
			props: { ...props },
			resolvers: []
		});
		overlays.push(options);
		return {
			...options,
			open: (props2) => open(options.id, props2),
			close: (value) => close(options.id, value),
			patch: (props2) => patch(options.id, props2)
		};
	};
	const open = (id, props) => {
		const overlay = getOverlay(id);
		if (props) overlay.props = {
			...overlay.originalProps,
			...props
		};
		else overlay.props = { ...overlay.originalProps };
		overlay.isOpen = true;
		overlay.isMounted = true;
		const result = new Promise((resolve) => overlay.resolvers.push(resolve));
		return Object.assign(result, {
			id,
			isMounted: overlay.isMounted,
			isOpen: overlay.isOpen,
			result
		});
	};
	const close = (id, value) => {
		const overlay = getOverlay(id);
		overlay.isOpen = false;
		for (const resolve of overlay.resolvers.splice(0)) resolve(value);
	};
	const closeAll = () => {
		overlays.forEach((overlay) => close(overlay.id));
	};
	const unmount = (id) => {
		const overlay = getOverlay(id);
		overlay.isMounted = false;
		if (overlay.destroyOnClose) {
			const index = overlays.findIndex((overlay2) => overlay2.id === id);
			overlays.splice(index, 1);
		}
	};
	const patch = (id, props) => {
		const overlay = getOverlay(id);
		overlay.props = {
			...overlay.props,
			...props
		};
	};
	const getOverlay = (id) => {
		const overlay = overlays.find((overlay2) => overlay2.id === id);
		if (!overlay) throw new Error("Overlay not found");
		return overlay;
	};
	const isOpen = (id) => {
		return getOverlay(id).isOpen;
	};
	return {
		overlays,
		open,
		close,
		closeAll,
		create,
		patch,
		unmount,
		isOpen
	};
}
var useOverlay = /* @__PURE__ */ createSharedComposable(_useOverlay);
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue
var _sfc_main$3 = {
	__name: "UOverlayProvider",
	__ssrInlineRender: true,
	setup(__props) {
		const { overlays, unmount, close } = useOverlay();
		const mountedOverlays = computed(() => overlays.filter((overlay) => overlay.isMounted));
		const onAfterLeave = (id) => {
			close(id);
			unmount(id);
		};
		const onClose = (id, value) => {
			close(id, value);
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<!--[-->`);
			ssrRenderList(mountedOverlays.value, (overlay) => {
				ssrRenderVNode(_push, createVNode(resolveDynamicComponent(overlay.component), mergeProps({ key: overlay.id }, { ref_for: true }, overlay.props, {
					open: overlay.isOpen,
					"onUpdate:open": ($event) => overlay.isOpen = $event,
					onClose: (value) => onClose(overlay.id, value),
					"onAfter:leave": ($event) => onAfterLeave(overlay.id)
				}), null), _parent);
			});
			_push(`<!--]-->`);
		};
	}
};
var _sfc_setup$4 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/OverlayProvider.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/App.vue
var _sfc_main$2 = /*@__PURE__*/ Object.assign({ name: "App" }, {
	__ssrInlineRender: true,
	props: {
		tooltip: {
			type: Object,
			required: false
		},
		toaster: {
			type: [Object, null],
			required: false
		},
		locale: {
			type: Object,
			required: false
		},
		portal: {
			type: [Boolean, String],
			required: false,
			skipCheck: true,
			default: "body"
		},
		dir: {
			type: String,
			required: false
		},
		scrollBody: {
			type: [Boolean, Object],
			required: false
		},
		nonce: {
			type: String,
			required: false
		}
	},
	setup(__props) {
		const props = __props;
		const configProviderProps = useForwardProps$1(reactivePick(props, "scrollBody"));
		const tooltipProps = toRef(() => props.tooltip);
		const toasterProps = toRef(() => props.toaster);
		const locale = toRef(() => props.dir ? {
			...props.locale || en_default,
			dir: props.dir
		} : props.locale);
		provide(localeContextInjectionKey, locale);
		const portal = toRef(() => props.portal);
		provide(portalTargetInjectionKey, portal);
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ConfigProvider_default), mergeProps({
				"use-id": () => useId(),
				dir: props.dir || locale.value?.dir,
				locale: locale.value?.code
			}, unref(configProviderProps), _attrs), {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(TooltipProvider_default), tooltipProps.value, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) {
								if (__props.toaster !== null) _push(ssrRenderComponent(Toaster_default, toasterProps.value, {
									default: withCtx((_, _push, _parent, _scopeId) => {
										if (_push) ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
										else return [renderSlot(_ctx.$slots, "default")];
									}),
									_: 3
								}, _parent, _scopeId));
								else ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent, _scopeId);
								_push(ssrRenderComponent(_sfc_main$3, null, null, _parent, _scopeId));
							} else return [__props.toaster !== null ? (openBlock(), createBlock(Toaster_default, mergeProps({ key: 0 }, toasterProps.value), {
								default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
								_: 3
							}, 16)) : renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 1), createVNode(_sfc_main$3)];
						}),
						_: 3
					}, _parent, _scopeId));
					else return [createVNode(unref(TooltipProvider_default), tooltipProps.value, {
						default: withCtx(() => [__props.toaster !== null ? (openBlock(), createBlock(Toaster_default, mergeProps({ key: 0 }, toasterProps.value), {
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 3
						}, 16)) : renderSlot(_ctx.$slots, "default", {}, void 0, void 0, 1), createVNode(_sfc_main$3)]),
						_: 3
					}, 16)];
				}),
				_: 3
			}, _parent));
		};
	}
});
var _sfc_setup$3 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt+ui@4.11.3_puea3ifctuk3igukiehiexehgq/node_modules/@nuxt/ui/dist/runtime/components/App.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var App_default = Object.assign(_sfc_main$2, { __name: "UApp" });
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/composables/layout.js
function routeRulesMatcher(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default();
}
function resolveLayoutName(route, name) {
	return unref(name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path ?? "/").appLayout ?? "default";
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Flayouts.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default = { default: defineAsyncComponent(() => import('../build/default-9avYfkL-.mjs').then((m) => m.default || m)) };
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-layout.js
var LayoutLoader = defineComponent({
	name: "LayoutLoader",
	inheritAttrs: false,
	props: {
		name: String,
		layoutProps: Object
	},
	setup(props, context) {
		return () => h(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default[props.name], props.layoutProps, context.slots);
	}
});
var nuxt_layout_default = defineComponent({
	name: "NuxtLayout",
	inheritAttrs: false,
	props: {
		name: {
			type: [
				String,
				Boolean,
				Object
			],
			default: null
		},
		fallback: {
			type: [String, Object],
			default: null
		}
	},
	setup(props, context) {
		const nuxtApp = useNuxtApp();
		const injectedRoute = inject(PageRouteSymbol);
		const route = !injectedRoute || injectedRoute === useRoute$1() ? useRoute() : injectedRoute;
		const layout = computed(() => {
			let layout = resolveLayoutName(route, props.name);
			if (layout && !(layout in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) {
				if (props.fallback) layout = unref(props.fallback);
			}
			return layout;
		});
		provide(LayoutSymbol, layout);
		const resolveRouteLayout = (routeToCheck) => resolveLayoutName(routeToCheck, props.name);
		const layoutRef = shallowRef();
		context.expose({ layoutRef });
		const done = nuxtApp.deferHydration();
		let lastLayout;
		return () => {
			const hasTransition = !!layout.value && layout.value in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default && !!(route?.meta.layoutTransition ?? false);
			const transitionProps = hasTransition && _mergeTransitionProps([
				route?.meta.layoutTransition,
				false,
				{
					onBeforeLeave() {
						_startTransition(nuxtApp);
					},
					onAfterLeave() {
						_finishTransition(nuxtApp);
					}
				}
			]);
			const previouslyRenderedLayout = lastLayout;
			lastLayout = layout.value;
			return _wrapInTransition(transitionProps, { default: () => h(Suspense, {
				suspensible: true,
				onResolve: async () => {
					await nextTick(done);
				}
			}, { default: () => h(LayoutProvider, {
				layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
				key: layout.value || void 0,
				name: layout.value,
				shouldProvide: !props.name,
				resolveRouteLayout,
				isRenderingNewLayout: (name) => {
					return name !== previouslyRenderedLayout && name === layout.value;
				},
				hasTransition
			}, context.slots) }) }).default();
		};
	}
});
var LayoutProvider = defineComponent({
	name: "NuxtLayoutProvider",
	inheritAttrs: false,
	props: {
		name: { type: [String, Boolean] },
		layoutProps: { type: Object },
		hasTransition: { type: Boolean },
		shouldProvide: { type: Boolean },
		isRenderingNewLayout: {
			type: Function,
			required: true
		},
		resolveRouteLayout: {
			type: Function,
			required: true
		}
	},
	setup(props, context) {
		const name = props.name;
		if (props.shouldProvide) provide(LayoutMetaSymbol, { isCurrent: (route) => name === false || name === props.resolveRouteLayout(route) });
		const injectedRoute = inject(PageRouteSymbol);
		const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute$1();
		const enclosingLayout = inject(LayoutMetaSymbol, null);
		if (isNotWithinNuxtPage) {
			const vueRouterRoute = useRoute();
			const reactiveChildRoute = {};
			for (const _key in vueRouterRoute) {
				const key = _key;
				Object.defineProperty(reactiveChildRoute, key, {
					enumerable: true,
					get: () => {
						return props.isRenderingNewLayout(props.name) && (!enclosingLayout || enclosingLayout.isCurrent(vueRouterRoute)) ? vueRouterRoute[key] : injectedRoute[key];
					}
				});
			}
			provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
		}
		return () => {
			if (!name || typeof name === "string" && !(name in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) return context.slots.default?.();
			return h(LayoutLoader, {
				key: name,
				layoutProps: props.layoutProps,
				name
			}, context.slots);
		};
	}
});
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
//#endregion
//#region app/app.vue?vue&type=script&setup=true&lang.ts
var app_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "app",
	__ssrInlineRender: true,
	setup(__props) {
		useHead({
			title: "Kapares Resto",
			meta: [{
				name: "viewport",
				content: "width=device-width, initial-scale=1.0"
			}, {
				name: "description",
				content: "Best Beef Pares in the country - Kapares Resto"
			}],
			link: [{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600&family=Roboto:wght@100;300&display=swap"
			}]
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_UApp = App_default;
			const _component_NuxtLayout = nuxt_layout_default;
			const _component_NuxtPage = page_default;
			_push(ssrRenderComponent(_component_UApp, _attrs, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(_component_NuxtLayout, null, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent, _scopeId));
							else return [createVNode(_component_NuxtPage)];
						}),
						_: 1
					}, _parent, _scopeId));
					else return [createVNode(_component_NuxtLayout, null, {
						default: withCtx(() => [createVNode(_component_NuxtPage)]),
						_: 1
					})];
				}),
				_: 1
			}, _parent));
		};
	}
});
//#endregion
//#region app/app.vue
var _sfc_setup$2 = app_vue_vue_type_script_setup_true_lang_default.setup;
app_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var app_default = app_vue_vue_type_script_setup_true_lang_default;
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-error-page.vue
var _sfc_main$1 = {
	__name: "nuxt-error-page",
	__ssrInlineRender: true,
	props: { error: Object },
	setup(__props) {
		const _error = __props.error;
		const status = Number(_error.statusCode || 500);
		const is404 = status === 404;
		const statusText = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
		const description = _error.message || _error.toString();
		const stack = void 0;
		const _Error404 = defineAsyncComponent(() => import('../build/error-404-xoPVWwhR.mjs'));
		const _Error = defineAsyncComponent(() => import('../build/error-500-Cd2mW8CU.mjs'));
		const ErrorTemplate = is404 ? _Error404 : _Error;
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({
				status: unref(status),
				statusText: unref(statusText),
				statusCode: unref(status),
				statusMessage: unref(statusText),
				description: unref(description),
				stack: unref(stack)
			}, _attrs), null, _parent));
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/.pnpm/nuxt@4.6.1_@babel+plugin-syntax-jsx@7.29.7_@babel+core@7.29.7__@babel+plugin-syntax-typescrip_hsapgbfqc3547hvvwrzqmkl4su/node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { getActiveElement as A, AUTOFOCUS_ON_UNMOUNT as B, focus as C, onKeyStroke as D, isNullish as E, FieldGroupReset as F, createSharedComposable as G, AUTOFOCUS_ON_MOUNT as H, focusFirst as I, getTabbableCandidates as J, EVENT_OPTIONS as K, getTabbableEdges as L, createGlobalState as M, NuxtLink as N, useHead as O, Primitive as P, entry as Q, Teleport_default as T, VisuallyHidden_default as V, _sfc_main$7 as _, useVModel as a, br as b, useAppConfig as c, useFormField as d, useComponentIcons as e, _sfc_main$12 as f, _sfc_main$10 as g, useState as h, isEmpty as i, useLocale as j, useForwardProps as k, looseToNumber as l, usePortal as m, createReusableTemplate as n, useFieldGroup as o, useEmitAsProps as p, qn as q, reactivePick as r, useForwardExpose as s, tv as t, useComponentProps as u, Presence_default as v, createContext as w, injectConfigProviderContext as x, unrefElement as y, tryOnBeforeUnmount as z };
//# sourceMappingURL=entry.mjs.map
