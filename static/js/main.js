/**
 * 机场Review (jichangreview.cfd) - 前端核心交互脚本
 * 全站即时搜索 (index.json)、移动端汉堡抽屉、优惠码一键复制
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initMobileDrawer();
  initCouponCopy();
});

// 1. 全站即时全文搜索 (基于 Hugo 编译生成的 index.json，覆盖标题、正文、FAQ、机场名、客户端)
function initSearch() {
  const triggerBtns = document.querySelectorAll('.search-trigger-btn');
  const modal = document.getElementById('search-modal');
  const closeBtn = document.getElementById('search-modal-close');
  const input = document.getElementById('search-modal-input');
  const resultsContainer = document.getElementById('search-results-list');

  if (!modal || !input || !resultsContainer) return;

  let searchIndex = null;
  let isLoading = false;

  async function loadSearchIndex() {
    if (searchIndex || isLoading) return;
    isLoading = true;
    try {
      const res = await fetch('/index.json');
      if (res.ok) {
        searchIndex = await res.json();
        renderResults();
      }
    } catch (e) {
      console.warn('Failed to load search index:', e);
    } finally {
      isLoading = false;
    }
  }

  function openSearch() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    loadSearchIndex();
    setTimeout(() => input.focus(), 60);
  }

  function closeSearch() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    input.value = '';
    resultsContainer.innerHTML = '<div class="search-initial-hint">输入关键词（如：梯子云、专线、Clash、小火箭、月付、全红、ChatGPT...）开始搜索</div>';
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openSearch));
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('search-modal-backdrop')) {
      closeSearch();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      modal.style.display === 'flex' ? closeSearch() : openSearch();
    }
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeSearch();
    }
  });

  input.addEventListener('input', renderResults);

  function renderResults() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      resultsContainer.innerHTML = '<div class="search-initial-hint">输入关键词（如：梯子云、专线、Clash、小火箭、月付、全红、ChatGPT...）开始搜索</div>';
      return;
    }

    if (!searchIndex) {
      resultsContainer.innerHTML = '<div class="search-initial-hint">正在加载搜索索引，请稍候...</div>';
      return;
    }

    const matches = searchIndex.filter(item => {
      const title = (item.title || '').toLowerCase();
      const summary = (item.summary || '').toLowerCase();
      const content = (item.content || '').toLowerCase();
      const keywords = Array.isArray(item.keywords) ? item.keywords.join(' ').toLowerCase() : '';
      return title.includes(query) || summary.includes(query) || content.includes(query) || keywords.includes(query);
    }).slice(0, 16);

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div class="search-initial-hint">未找到与 "<strong>${escapeHtml(query)}</strong>" 匹配的内容，可尝试更换关键词（如：Clash、月付、专线、小火箭）</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.map(item => `
      <a href="${item.permalink}" class="search-result-item">
        <div class="search-result-title">${highlight(item.title, query)}</div>
        <div class="search-result-snippet">${highlight(item.summary || item.content || '', query)}</div>
      </a>
    `).join('');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, term) {
    if (!text) return '';
    const safe = escapeHtml(text);
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.replace(regex, '<mark style="background-color: #fef08a; color: #000; padding: 1px 3px; border-radius: 2px;">$1</mark>');
  }
}

// 2. 移动端抽屉导航
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close-btn');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 点击抽屉外部遮罩区域关闭
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

// 3. 优惠码一键复制
function initCouponCopy() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copy-mini');
    if (!btn) return;

    let code = btn.dataset.code || '';
    if (!code) {
      const parent = btn.closest('.coupon-display, .featured-coupon-box, .entry-coupon-row');
      const codeEl = parent ? parent.querySelector('.coupon-code, .coupon-val') : null;
      code = codeEl ? codeEl.innerText.trim() : '';
    }

    if (!code || code === '待核实' || code === '以结算页为准' || code === '已复制！') return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }

      const origText = btn.innerText;
      btn.innerText = '已复制！';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.innerText = origText;
        btn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      console.warn('Clipboard failed:', err);
    }
  });
}
