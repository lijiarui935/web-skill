/**
 * 姓名：李嘉蕊 | 学号：24002120526 | 时间：2026-11-20 | 大模型：DeepSeek-V4.1-Flash
 * 功能：数据库连接测试页，提交用户名密码到 /api/db-test，成功绿色、失败红色
 */
(function () {
    'use strict';

    var LJR_form = document.getElementById('LJR_db_form');
    var LJR_result = document.getElementById('LJR_result');
    var LJR_button = document.getElementById('LJR_submit');
    var LJR_apiUrl = document.getElementById('LJR_api_url');

    if (LJR_apiUrl) {
        LJR_apiUrl.textContent = window.location.origin + '/api/db-test';
    }

    function LJR_show(LJR_text, LJR_isOk) {
        LJR_result.textContent = LJR_text;
        LJR_result.classList.remove('LJR_ok', 'LJR_bad');
        LJR_result.classList.add(LJR_isOk ? 'LJR_ok' : 'LJR_bad');
    }

    LJR_form.addEventListener('submit', function (LJR_e) {
        LJR_e.preventDefault();

        var LJR_username = document.getElementById('LJR_username').value.trim();
        var LJR_password = document.getElementById('LJR_password').value;

        if (!LJR_username) {
            LJR_show('请先填写数据库用户名', false);
            return;
        }

        LJR_button.disabled = true;
        LJR_result.textContent = '正在连接 MySQL……';
        LJR_result.classList.remove('LJR_ok', 'LJR_bad');

        fetch('/api/db-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: LJR_username, password: LJR_password })
        })
            .then(function (LJR_res) { return LJR_res.json(); })
            .then(function (LJR_data) {
                console.log('[db-test] 后端返回：', LJR_data);
                if (LJR_data.code === 0) {
                    LJR_show('✓ 连接成功\n数据库版本：' + LJR_data.data.version + '\n主机：' + LJR_data.data.host + '\n用户：' + LJR_data.data.user, true);
                } else {
                    LJR_show('✗ 连接失败\n' + LJR_data.msg, false);
                }
            })
            .catch(function (LJR_err) {
                console.error('[db-test] 请求失败：', LJR_err);
                LJR_show('✗ 请求失败：' + LJR_err.message + '\n请确认后端已启动（http://localhost:8526）', false);
            })
            .finally(function () {
                LJR_button.disabled = false;
            });
    });
})();
