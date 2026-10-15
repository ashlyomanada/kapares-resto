import { N as NuxtLink, _ as _sfc_main$7 } from '../virtual/entry.mjs';
import { u as useCart, _ as _sfc_main$1, a as _sfc_main } from './useCart-Cr7l4sWX.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, unref, openBlock, createBlock, createCommentVNode, isRef, Fragment, renderList, useSSRContext } from 'vue';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import 'node:module';
import 'node:crypto';
import 'node:buffer';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'tailwindcss/colors';
import '../nitro/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:events';
import '@iconify/utils';
import 'consola';
import 'nostics';
import 'vue-bundle-renderer/runtime';
import 'devalue';

//#region \0virtual:public?%2Fpares_png%2Fsearch.png
var _virtual_public__2Fpares_png_2Fsearch_default = publicAssetsURL("/pares_png/search.png");
//#endregion
//#region \0virtual:public?%2Fpares_png%2Fnotification.png
var _virtual_public__2Fpares_png_2Fnotification_default = publicAssetsURL("/pares_png/notification.png");
//#endregion
//#region \0virtual:public?%2Fpares_png%2Fshopping-cart.png
var _virtual_public__2Fpares_png_2Fshopping_cart_default = publicAssetsURL("/pares_png/shopping-cart.png");
//#endregion
//#region app/layouts/default.vue?vue&type=script&setup=true&lang.ts
var default_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "default",
	__ssrInlineRender: true,
	setup(__props) {
		const isMobileMenuOpen = ref(false);
		const isSearchOpen = ref(false);
		const isNotifOpen = ref(false);
		const searchQuery = ref("");
		const { items, isCartOpen, removeFromCart, totalCount, totalPrice } = useCart();
		const navLinks = [
			{
				label: "HOME",
				to: "#home"
			},
			{
				label: "MENU",
				to: "#menu"
			},
			{
				label: "ABOUT",
				to: "#about"
			},
			{
				label: "OTHERS",
				to: "#others"
			},
			{
				label: "REVIEW",
				to: "#review"
			},
			{
				label: "ORDER",
				to: "#order"
			}
		];
		const closeMobileMenu = () => {
			isMobileMenuOpen.value = false;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_NuxtLink = NuxtLink;
			const _component_UButton = _sfc_main$7;
			const _component_UModal = _sfc_main$1;
			const _component_UInput = _sfc_main;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#2d1f1a] text-white flex flex-col font-['Poppins']" }, _attrs))}><header class="fixed top-0 left-0 right-0 h-16 bg-[#1b1514] z-50 shadow-[0px_22px_18px_-16px_rgba(0,0,0,0.1)] flex items-center justify-between px-6 md:px-12 max-w-[1350px] mx-auto w-full">`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "#home",
				class: "text-xl md:text-2xl font-bold tracking-wider hover:text-[#c46e3e] transition-colors"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(` KAPARES `);
					else return [createTextVNode(" KAPARES ")];
				}),
				_: 1
			}, _parent));
			_push(`<nav class="hidden md:flex items-center gap-8 list-none"><!--[-->`);
			ssrRenderList(navLinks, (link) => {
				_push(ssrRenderComponent(_component_NuxtLink, {
					key: link.label,
					to: link.to,
					class: "text-sm font-medium tracking-wide text-white hover:text-[#c46e3e] transition-colors"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(link.label)}`);
						else return [createTextVNode(toDisplayString(link.label), 1)];
					}),
					_: 2
				}, _parent));
			});
			_push(`<!--]--></nav><div class="hidden md:flex items-center gap-3">`);
			_push(ssrRenderComponent(_component_UButton, {
				color: "neutral",
				variant: "ghost",
				size: "sm",
				class: "rounded-full p-2 hover:opacity-75 transition-opacity",
				"aria-label": "Search",
				onClick: ($event) => isSearchOpen.value = true
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fsearch_default)} alt="Search" class="w-5 h-5 object-contain"${_scopeId}>`);
					else return [createVNode("img", {
						src: _virtual_public__2Fpares_png_2Fsearch_default,
						alt: "Search",
						class: "w-5 h-5 object-contain"
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				color: "neutral",
				variant: "ghost",
				size: "sm",
				class: "rounded-full p-2 hover:opacity-75 transition-opacity",
				"aria-label": "Notifications",
				onClick: ($event) => isNotifOpen.value = true
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fnotification_default)} alt="Notification" class="w-5 h-5 object-contain"${_scopeId}>`);
					else return [createVNode("img", {
						src: _virtual_public__2Fpares_png_2Fnotification_default,
						alt: "Notification",
						class: "w-5 h-5 object-contain"
					})];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UButton, {
				color: "neutral",
				variant: "ghost",
				size: "sm",
				class: "rounded-full p-2 hover:opacity-75 transition-opacity relative",
				"aria-label": "Cart",
				onClick: ($event) => isCartOpen.value = true
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fshopping_cart_default)} alt="Cart" class="w-5 h-5 object-contain"${_scopeId}>`);
						if (unref(totalCount) > 0) _push(`<span class="absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"${_scopeId}>${ssrInterpolate(unref(totalCount))}</span>`);
						else _push(`<!---->`);
					} else return [createVNode("img", {
						src: _virtual_public__2Fpares_png_2Fshopping_cart_default,
						alt: "Cart",
						class: "w-5 h-5 object-contain"
					}), unref(totalCount) > 0 ? (openBlock(), createBlock("span", {
						key: 0,
						class: "absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
					}, toDisplayString(unref(totalCount)), 1)) : createCommentVNode("", true)];
				}),
				_: 1
			}, _parent));
			_push(`</div><button class="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8 focus:outline-none cursor-pointer" aria-label="Toggle Menu"><span class="w-6 h-0.5 bg-white transition-all"></span><span class="w-6 h-0.5 bg-white transition-all"></span><span class="w-6 h-0.5 bg-white transition-all"></span></button>`);
			if (unref(isMobileMenuOpen)) {
				_push(`<div class="absolute top-16 left-0 w-full bg-[#1b1514] flex flex-col items-center py-6 gap-5 shadow-2xl md:hidden"><!--[-->`);
				ssrRenderList(navLinks, (link) => {
					_push(ssrRenderComponent(_component_NuxtLink, {
						key: link.label,
						to: link.to,
						class: "text-base font-medium tracking-wide hover:text-[#c46e3e] transition-colors",
						onClick: closeMobileMenu
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(link.label)}`);
							else return [createTextVNode(toDisplayString(link.label), 1)];
						}),
						_: 2
					}, _parent));
				});
				_push(`<!--]--><div class="flex items-center gap-6 pt-3 border-t border-stone-800 w-3/4 justify-center">`);
				_push(ssrRenderComponent(_component_UButton, {
					color: "neutral",
					variant: "ghost",
					class: "rounded-full p-2",
					onClick: ($event) => {
						isSearchOpen.value = true;
						closeMobileMenu();
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fsearch_default)} alt="Search" class="w-5 h-5"${_scopeId}>`);
						else return [createVNode("img", {
							src: _virtual_public__2Fpares_png_2Fsearch_default,
							alt: "Search",
							class: "w-5 h-5"
						})];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UButton, {
					color: "neutral",
					variant: "ghost",
					class: "rounded-full p-2",
					onClick: ($event) => {
						isNotifOpen.value = true;
						closeMobileMenu();
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fnotification_default)} alt="Notifications" class="w-5 h-5"${_scopeId}>`);
						else return [createVNode("img", {
							src: _virtual_public__2Fpares_png_2Fnotification_default,
							alt: "Notifications",
							class: "w-5 h-5"
						})];
					}),
					_: 1
				}, _parent));
				_push(ssrRenderComponent(_component_UButton, {
					color: "neutral",
					variant: "ghost",
					class: "rounded-full p-2 relative",
					onClick: ($event) => {
						isCartOpen.value = true;
						closeMobileMenu();
					}
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) {
							_push(`<img${ssrRenderAttr("src", _virtual_public__2Fpares_png_2Fshopping_cart_default)} alt="Cart" class="w-5 h-5"${_scopeId}>`);
							if (unref(totalCount) > 0) _push(`<span class="absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"${_scopeId}>${ssrInterpolate(unref(totalCount))}</span>`);
							else _push(`<!---->`);
						} else return [createVNode("img", {
							src: _virtual_public__2Fpares_png_2Fshopping_cart_default,
							alt: "Cart",
							class: "w-5 h-5"
						}), unref(totalCount) > 0 ? (openBlock(), createBlock("span", {
							key: 0,
							class: "absolute -top-1 -right-1 bg-[#c46e3e] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
						}, toDisplayString(unref(totalCount)), 1)) : createCommentVNode("", true)];
					}),
					_: 1
				}, _parent));
				_push(`</div></div>`);
			} else _push(`<!---->`);
			_push(`</header><main class="flex-1 pt-16 max-w-[1350px] mx-auto w-full">`);
			ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
			_push(`</main><footer class="bg-[#1b1514] py-12 px-6 md:px-16 w-full max-w-[1350px] mx-auto border-t border-stone-900"><div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center md:text-left"><div class="flex flex-col gap-2"><h3 class="text-lg font-semibold text-white mb-2">Location</h3><p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "#home",
				class: "text-sm text-stone-300 hover:text-[#c46e3e]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Calapan City`);
					else return [createTextVNode("Calapan City")];
				}),
				_: 1
			}, _parent));
			_push(`</p><p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "#home",
				class: "text-sm text-stone-300 hover:text-[#c46e3e]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Naujan`);
					else return [createTextVNode("Naujan")];
				}),
				_: 1
			}, _parent));
			_push(`</p><p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "#home",
				class: "text-sm text-stone-300 hover:text-[#c46e3e]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Pinamalayan`);
					else return [createTextVNode("Pinamalayan")];
				}),
				_: 1
			}, _parent));
			_push(`</p><p>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "#home",
				class: "text-sm text-stone-300 hover:text-[#c46e3e]"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Roxas`);
					else return [createTextVNode("Roxas")];
				}),
				_: 1
			}, _parent));
			_push(`</p></div><div class="flex flex-col gap-2"><h3 class="text-lg font-semibold text-white mb-2">Contact Info</h3><p><a href="tel:+639507335078" class="text-sm text-stone-300 hover:text-[#c46e3e]">+639507335078</a></p><p><a href="mailto:ashlyomanada@gmail.com" class="text-sm text-stone-300 hover:text-[#c46e3e]">ashlyomanada@gmail.com</a></p></div><div class="flex flex-col gap-2"><h3 class="text-lg font-semibold text-white mb-2">Follow Us</h3><p><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Facebook</a></p><p><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Twitter</a></p><p><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">Instagram</a></p><p><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="text-sm text-stone-300 hover:text-[#c46e3e]">YouTube</a></p></div></div><div class="text-center pt-6 border-t border-stone-800"><h3 class="text-xs text-stone-400">Copyright © 2023 By Mr. Ashly Omañada</h3></div></footer>`);
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(isSearchOpen),
				"onUpdate:open": ($event) => isRef(isSearchOpen) ? isSearchOpen.value = $event : null,
				title: "Search Menu"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Search Menu</h3>`);
						_push(ssrRenderComponent(_component_UInput, {
							modelValue: unref(searchQuery),
							"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
							placeholder: "Search beef pares, recipes...",
							class: "w-full",
							autofocus: ""
						}, null, _parent, _scopeId));
						_push(`<div class="flex justify-end gap-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isSearchOpen.value = false
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Close`);
								else return [createTextVNode("Close")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_UButton, {
							color: "primary",
							class: "bg-[#c46e3e] text-white",
							onClick: ($event) => isSearchOpen.value = false
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Search`);
								else return [createTextVNode("Search")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
					} else return [createVNode("div", { class: "p-4 space-y-4 bg-[#1b1514] text-white rounded-xl" }, [
						createVNode("h3", { class: "text-lg font-semibold" }, "Search Menu"),
						createVNode(_component_UInput, {
							modelValue: unref(searchQuery),
							"onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
							placeholder: "Search beef pares, recipes...",
							class: "w-full",
							autofocus: ""
						}, null, 8, ["modelValue", "onUpdate:modelValue"]),
						createVNode("div", { class: "flex justify-end gap-2" }, [createVNode(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isSearchOpen.value = false
						}, {
							default: withCtx(() => [createTextVNode("Close")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_UButton, {
							color: "primary",
							class: "bg-[#c46e3e] text-white",
							onClick: ($event) => isSearchOpen.value = false
						}, {
							default: withCtx(() => [createTextVNode("Search")]),
							_: 1
						}, 8, ["onClick"])])
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(isNotifOpen),
				"onUpdate:open": ($event) => isRef(isNotifOpen) ? isNotifOpen.value = $event : null,
				title: "Notifications"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Notifications</h3><div class="space-y-2 text-sm text-stone-300"${_scopeId}><div class="p-3 bg-stone-900 rounded-lg border border-stone-800"${_scopeId}><p class="font-medium text-white"${_scopeId}>🎉 Special Promo Today!</p><p class="text-xs text-stone-400"${_scopeId}>Order any Beef Pares and get free soup refills.</p></div><div class="p-3 bg-stone-900 rounded-lg border border-stone-800"${_scopeId}><p class="font-medium text-white"${_scopeId}>🛵 Fast Delivery Available</p><p class="text-xs text-stone-400"${_scopeId}>Free delivery on orders within Calapan City.</p></div></div><div class="flex justify-end"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isNotifOpen.value = false
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Close`);
								else return [createTextVNode("Close")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
					} else return [createVNode("div", { class: "p-4 space-y-4 bg-[#1b1514] text-white rounded-xl" }, [
						createVNode("h3", { class: "text-lg font-semibold" }, "Notifications"),
						createVNode("div", { class: "space-y-2 text-sm text-stone-300" }, [createVNode("div", { class: "p-3 bg-stone-900 rounded-lg border border-stone-800" }, [createVNode("p", { class: "font-medium text-white" }, "🎉 Special Promo Today!"), createVNode("p", { class: "text-xs text-stone-400" }, "Order any Beef Pares and get free soup refills.")]), createVNode("div", { class: "p-3 bg-stone-900 rounded-lg border border-stone-800" }, [createVNode("p", { class: "font-medium text-white" }, "🛵 Fast Delivery Available"), createVNode("p", { class: "text-xs text-stone-400" }, "Free delivery on orders within Calapan City.")])]),
						createVNode("div", { class: "flex justify-end" }, [createVNode(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isNotifOpen.value = false
						}, {
							default: withCtx(() => [createTextVNode("Close")]),
							_: 1
						}, 8, ["onClick"])])
					])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_UModal, {
				open: unref(isCartOpen),
				"onUpdate:open": ($event) => isRef(isCartOpen) ? isCartOpen.value = $event : null,
				title: "Your Cart"
			}, {
				content: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="p-4 space-y-4 bg-[#1b1514] text-white rounded-xl"${_scopeId}><h3 class="text-lg font-semibold"${_scopeId}>Your Cart</h3>`);
						if (unref(items).length === 0) _push(`<div class="py-8 text-center text-stone-400 text-sm"${_scopeId}> Your cart is currently empty. </div>`);
						else {
							_push(`<div class="space-y-3 max-h-60 overflow-y-auto"${_scopeId}><!--[-->`);
							ssrRenderList(unref(items), (item) => {
								_push(`<div class="flex items-center justify-between gap-3 p-2 bg-stone-900 rounded-lg border border-stone-800"${_scopeId}><img${ssrRenderAttr("src", item.image)}${ssrRenderAttr("alt", item.name)} class="w-12 h-12 rounded object-cover"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><p class="text-sm font-medium text-white truncate"${_scopeId}>${ssrInterpolate(item.name)}</p><p class="text-xs text-stone-400"${_scopeId}>Qty: ${ssrInterpolate(item.quantity)} × Php ${ssrInterpolate(item.price.toFixed(2))}</p></div><div class="text-right"${_scopeId}><p class="text-xs font-semibold text-white"${_scopeId}>Php ${ssrInterpolate((item.price * item.quantity).toFixed(2))}</p><button class="text-[11px] text-red-400 hover:underline cursor-pointer"${_scopeId}> Remove </button></div></div>`);
							});
							_push(`<!--]--><div class="pt-3 border-t border-stone-800 flex justify-between font-semibold text-base"${_scopeId}><span${_scopeId}>Total:</span><span class="text-[#c46e3e]"${_scopeId}>Php ${ssrInterpolate(unref(totalPrice).toFixed(2))}</span></div></div>`);
						}
						_push(`<div class="flex justify-between gap-2 pt-2"${_scopeId}>`);
						_push(ssrRenderComponent(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isCartOpen.value = false
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(`Close`);
								else return [createTextVNode("Close")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(ssrRenderComponent(_component_NuxtLink, {
							to: "#order",
							class: "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#c46e3e] text-white text-sm font-semibold hover:bg-stone-800 transition-colors",
							onClick: ($event) => isCartOpen.value = false
						}, {
							default: withCtx((_, _push, _parent, _scopeId) => {
								if (_push) _push(` Proceed to Order `);
								else return [createTextVNode(" Proceed to Order ")];
							}),
							_: 1
						}, _parent, _scopeId));
						_push(`</div></div>`);
					} else return [createVNode("div", { class: "p-4 space-y-4 bg-[#1b1514] text-white rounded-xl" }, [
						createVNode("h3", { class: "text-lg font-semibold" }, "Your Cart"),
						unref(items).length === 0 ? (openBlock(), createBlock("div", {
							key: 0,
							class: "py-8 text-center text-stone-400 text-sm"
						}, " Your cart is currently empty. ")) : (openBlock(), createBlock("div", {
							key: 1,
							class: "space-y-3 max-h-60 overflow-y-auto"
						}, [(openBlock(true), createBlock(Fragment, null, renderList(unref(items), (item) => {
							return openBlock(), createBlock("div", {
								key: item.id,
								class: "flex items-center justify-between gap-3 p-2 bg-stone-900 rounded-lg border border-stone-800"
							}, [
								createVNode("img", {
									src: item.image,
									alt: item.name,
									class: "w-12 h-12 rounded object-cover"
								}, null, 8, ["src", "alt"]),
								createVNode("div", { class: "flex-1 min-w-0" }, [createVNode("p", { class: "text-sm font-medium text-white truncate" }, toDisplayString(item.name), 1), createVNode("p", { class: "text-xs text-stone-400" }, "Qty: " + toDisplayString(item.quantity) + " × Php " + toDisplayString(item.price.toFixed(2)), 1)]),
								createVNode("div", { class: "text-right" }, [createVNode("p", { class: "text-xs font-semibold text-white" }, "Php " + toDisplayString((item.price * item.quantity).toFixed(2)), 1), createVNode("button", {
									class: "text-[11px] text-red-400 hover:underline cursor-pointer",
									onClick: ($event) => unref(removeFromCart)(item.name)
								}, " Remove ", 8, ["onClick"])])
							]);
						}), 128)), createVNode("div", { class: "pt-3 border-t border-stone-800 flex justify-between font-semibold text-base" }, [createVNode("span", null, "Total:"), createVNode("span", { class: "text-[#c46e3e]" }, "Php " + toDisplayString(unref(totalPrice).toFixed(2)), 1)])])),
						createVNode("div", { class: "flex justify-between gap-2 pt-2" }, [createVNode(_component_UButton, {
							color: "neutral",
							variant: "ghost",
							onClick: ($event) => isCartOpen.value = false
						}, {
							default: withCtx(() => [createTextVNode("Close")]),
							_: 1
						}, 8, ["onClick"]), createVNode(_component_NuxtLink, {
							to: "#order",
							class: "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#c46e3e] text-white text-sm font-semibold hover:bg-stone-800 transition-colors",
							onClick: ($event) => isCartOpen.value = false
						}, {
							default: withCtx(() => [createTextVNode(" Proceed to Order ")]),
							_: 1
						}, 8, ["onClick"])])
					])];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/layouts/default.vue
var _sfc_setup = default_vue_vue_type_script_setup_true_lang_default.setup;
default_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = default_vue_vue_type_script_setup_true_lang_default;

export { default_default as default };
//# sourceMappingURL=default-9avYfkL-.mjs.map
