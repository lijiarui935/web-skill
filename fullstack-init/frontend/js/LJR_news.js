/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：科技新闻页，fetch /api/news 并按发布时间展示
 */
(function () {
    'use strict';

    var LJR_list = document.getElementById('LJR_news_list');
    var LJR_loading = document.getElementById('LJR_loading');
    var LJR_apiUrl = document.getElementById('LJR_api_url');

    if (LJR_apiUrl) {
        LJR_apiUrl.textContent = window.location.origin + '/api/news';
    }

    function LJR_formatTime(LJR_value) {
        if (!LJR_value) return '—';
        var LJR_date = new Date(LJR_value);
        if (isNaN(LJR_date.getTime())) return String(LJR_value);
        var LJR_pad = function (LJR_n) { return LJR_n < 10 ? '0' + LJR_n : '' + LJR_n; };
        return LJR_date.getFullYear() + '-' + LJR_pad(LJR_date.getMonth() + 1) + '-' + LJR_pad(LJR_date.getDate()) +
            ' ' + LJR_pad(LJR_date.getHours()) + ':' + LJR_pad(LJR_date.getMinutes());
    }

    // 李嘉蕊：用 textContent 渲染，避免数据库内容里的特殊字符被当成 HTML
    function LJR_render(LJR_items) {
        LJR_list.innerHTML = '';
        if (!LJR_items || !LJR_items.length) {
            LJR_loading.textContent = '暂时没有新闻数据';
            return;
        }
        LJR_loading.style.display = 'none';

        LJR_items.forEach(function (LJR_item, LJR_index) {
            var LJR_box = document.createElement('article');
            LJR_box.className = 'LJR_news_item';

            var LJR_h3 = document.createElement('h3');
            LJR_h3.textContent = (LJR_index + 1) + '. ' + LJR_item.title;

            var LJR_p = document.createElement('p');
            LJR_p.textContent = LJR_item.summary;

            var LJR_meta = document.createElement('div');
            LJR_meta.className = 'LJR_news_meta';
            LJR_meta.innerHTML =
                '<span>来源：<b></b></span><span>发布时间：<b></b></span><span>新闻 ID：<b></b></span>';
            var LJR_b = LJR_meta.querySelectorAll('b');
            LJR_b[0].textContent = LJR_item.source;
            LJR_b[1].textContent = LJR_formatTime(LJR_item.publish_time);
            LJR_b[2].textContent = LJR_item.id;

            LJR_box.appendChild(LJR_h3);
            LJR_box.appendChild(LJR_p);
            LJR_box.appendChild(LJR_meta);
            LJR_list.appendChild(LJR_box);
        });
    }

    fetch('/api/news')
        .then(function (LJR_res) { return LJR_res.json(); })
        .then(function (LJR_data) {
            console.log('[news] 接口返回：', LJR_data);
            if (LJR_data.code !== 0) {
                LJR_loading.textContent = '接口返回异常：' + LJR_data.msg;
                return;
            }
            LJR_render(LJR_data.data);
        })
        .catch(function (LJR_err) {
            console.error('[news] 请求失败：', LJR_err);
            LJR_loading.textContent = '请求失败：' + LJR_err.message + '（请确认后端与 MySQL 已启动）';
        });
})();
