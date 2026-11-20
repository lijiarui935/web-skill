/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：图文列表页，fetch /api/gallery，网格展示上图下文卡片，图片失败显示占位色块
 */
(function () {
    'use strict';

    var LJR_grid = document.getElementById('LJR_gallery_grid');
    var LJR_loading = document.getElementById('LJR_loading');
    var LJR_apiUrl = document.getElementById('LJR_api_url');

    if (LJR_apiUrl) {
        LJR_apiUrl.textContent = window.location.origin + '/api/gallery';
    }

    // 李嘉蕊：破图兜底——加载失败直接换成渐变占位，不显示浏览器默认破图图标
    function LJR_fallback(LJR_img, LJR_title) {
        var LJR_canvas = document.createElement('canvas');
        LJR_canvas.width = 480;
        LJR_canvas.height = 340;
        var LJR_ctx = LJR_canvas.getContext('2d');
        var LJR_grad = LJR_ctx.createLinearGradient(0, 0, 480, 340);
        LJR_grad.addColorStop(0, '#13203a');
        LJR_grad.addColorStop(1, '#24405c');
        LJR_ctx.fillStyle = LJR_grad;
        LJR_ctx.fillRect(0, 0, 480, 340);
        LJR_ctx.strokeStyle = 'rgba(94, 224, 208, .35)';
        LJR_ctx.lineWidth = 2;
        for (var LJR_i = 0; LJR_i < 6; LJR_i++) {
            LJR_ctx.beginPath();
            LJR_ctx.arc(240, 170, 40 + LJR_i * 26, 0, Math.PI * 2);
            LJR_ctx.stroke();
        }
        LJR_ctx.fillStyle = 'rgba(232, 238, 252, .8)';
        LJR_ctx.font = '20px "Microsoft YaHei", sans-serif';
        LJR_ctx.textAlign = 'center';
        LJR_ctx.fillText(LJR_title || '图片加载失败', 240, 178, 400);
        LJR_img.src = LJR_canvas.toDataURL('image/png');
    }

    function LJR_render(LJR_items) {
        LJR_grid.innerHTML = '';
        if (!LJR_items || !LJR_items.length) {
            LJR_loading.textContent = '暂时没有图文数据';
            return;
        }
        LJR_loading.style.display = 'none';

        LJR_items.forEach(function (LJR_item) {
            var LJR_tile = document.createElement('article');
            LJR_tile.className = 'LJR_tile';

            var LJR_img = document.createElement('img');
            LJR_img.alt = LJR_item.title;
            LJR_img.loading = 'lazy';
            LJR_img.src = LJR_item.img_url;
            LJR_img.addEventListener('error', function () {
                LJR_fallback(LJR_img, LJR_item.title);
            }, { once: true });

            var LJR_body = document.createElement('div');
            LJR_body.className = 'LJR_tile_body';

            var LJR_tag = document.createElement('span');
            LJR_tag.className = 'LJR_tag';
            LJR_tag.textContent = LJR_item.category;

            var LJR_h3 = document.createElement('h3');
            LJR_h3.textContent = LJR_item.title;

            var LJR_p = document.createElement('p');
            LJR_p.textContent = LJR_item.description;

            LJR_body.appendChild(LJR_tag);
            LJR_body.appendChild(LJR_h3);
            LJR_body.appendChild(LJR_p);
            LJR_tile.appendChild(LJR_img);
            LJR_tile.appendChild(LJR_body);
            LJR_grid.appendChild(LJR_tile);
        });
    }

    fetch('/api/gallery')
        .then(function (LJR_res) { return LJR_res.json(); })
        .then(function (LJR_data) {
            console.log('[gallery] 接口返回：', LJR_data);
            if (LJR_data.code !== 0) {
                LJR_loading.textContent = '接口返回异常：' + LJR_data.msg;
                return;
            }
            LJR_render(LJR_data.data);
        })
        .catch(function (LJR_err) {
            console.error('[gallery] 请求失败：', LJR_err);
            LJR_loading.textContent = '请求失败：' + LJR_err.message + '（请确认后端与 MySQL 已启动）';
        });
})();
