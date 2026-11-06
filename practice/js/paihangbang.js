/**
 * 排行榜新闻页 · 通用 Tab 选项卡组件
 * 作者：李嘉蕊
 * 建立时间：2026-11-04
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：Tab 选项卡切换（新闻 / 证券 / 理财 / 博客）
 *
 * 用法：给任意容器加 data-ljr-tabs，内部放若干 [data-ljr-tab] 按钮
 * 和对应 [data-ljr-panel] 面板，脚本会自动接管，可同时存在多个实例。
 */
(function () {
    'use strict';

    /**
     * 主要功能：在指定容器内绑定选项卡点击监听，点击时先清除全部选项卡
     * 与面板的选中状态，再把当前点击的选项卡设为选中，并显示对应面板
     * 作者：李嘉蕊
     * @param {HTMLElement} ljr_root 带 data-ljr-tabs 的容器
     */
    function ljr_initTabs(ljr_root) {
        var ljr_tabs = ljr_root.querySelectorAll('[data-ljr-tab]');
        var ljr_panels = ljr_root.querySelectorAll('[data-ljr-panel]');

        if (!ljr_tabs.length) {
            return;
        }

        /**
         * 主要功能：切换选项卡激活状态——先逐个移除全部选项卡的选中样式和面板的显示状态，
         * 再为当前选项卡及其对应面板设置选中状态
         * 作者：李嘉蕊
         * @param {HTMLElement} ljr_current 当前被点击的选项卡
         */
        function ljr_activateTab(ljr_current) {
            var ljr_key = ljr_current.getAttribute('data-ljr-tab');

            // 第一步：清除所有选项卡的选中状态
            Array.prototype.forEach.call(ljr_tabs, function (ljr_tab) {
                ljr_tab.classList.remove('ljr_tab_active');
                ljr_tab.setAttribute('aria-selected', 'false');
            });

            // 第一步：同时隐藏所有面板
            Array.prototype.forEach.call(ljr_panels, function (ljr_panel) {
                ljr_panel.classList.remove('ljr_panel_active');
            });

            // 第二步：设置当前元素（选项卡及其面板）的选中状态
            ljr_current.classList.add('ljr_tab_active');
            ljr_current.setAttribute('aria-selected', 'true');

            Array.prototype.forEach.call(ljr_panels, function (ljr_panel) {
                if (ljr_panel.getAttribute('data-ljr-panel') === ljr_key) {
                    ljr_panel.classList.add('ljr_panel_active');
                }
            });
        }

        // 监听事件：为每个选项卡绑定点击
        Array.prototype.forEach.call(ljr_tabs, function (ljr_tab) {
            ljr_tab.addEventListener('click', function () {
                ljr_activateTab(ljr_tab);
            });
        });
    }

    /**
     * 主要功能：页面加载后查找所有 data-ljr-tabs 容器并逐个初始化选项卡
     * 作者：李嘉蕊
     */
    function ljr_bootTabs() {
        var ljr_roots = document.querySelectorAll('[data-ljr-tabs]');
        Array.prototype.forEach.call(ljr_roots, function (ljr_root) {
            ljr_initTabs(ljr_root);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ljr_bootTabs);
    } else {
        ljr_bootTabs();
    }
})();
