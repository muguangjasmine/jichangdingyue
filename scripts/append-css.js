const fs = require('fs');
const cssPath = 'C:/Users/USER/Desktop/博客域名/jichangdingyue.xyz/static/css/style.css';
let css = fs.readFileSync(cssPath, 'utf-8');

const couponRedCss = `
/* 优惠码高亮红色样式 */
.coupon-code, .coupon-code-text, .coupon-val, .coupon-highlight {
  color: #dc2626 !important;
  font-weight: 700 !important;
  font-family: var(--font-mono);
}
.featured-coupon-box {
  background: #fef2f2 !important;
  border: 1px dashed #ef4444 !important;
}
.btn-copy-mini {
  background: #dc2626 !important;
  color: #ffffff !important;
  border: none !important;
}
`;

css += '\n' + couponRedCss;
fs.writeFileSync(cssPath, css, 'utf-8');
console.log('Appended red coupon styles to style.css');
