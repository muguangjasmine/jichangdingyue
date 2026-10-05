const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const contentAirportsDir = path.join(__dirname, '..', 'content', 'airports');

const couponMap = {
  "laddercloud": {
    coupon: "tiziyun",
    coupon_discount: "全场9折",
    coupon_note: "输入优惠码 tiziyun 可享全场 9 折常规优惠，结算页自动抵扣。",
    coupon_expiry: "长期有效"
  },
  "twilight": {
    coupon: "mm88",
    coupon_discount: "专线专享88折",
    coupon_note: "输入优惠码 mm88 可享 IEPL 纯专线套餐 88 折专享折扣。",
    coupon_expiry: "长期有效"
  },
  "flycat": {
    coupon: "flycat888",
    coupon_discount: "年付立减/特惠折上折",
    coupon_note: "输入优惠码 flycat888 可享年付轻量套餐专属优惠，折后月均极低。",
    coupon_expiry: "长期有效"
  },
  "breezenet": {
    coupon: "8888",
    coupon_discount: "全场9折",
    coupon_note: "输入优惠码 8888 享大流量套餐与不限时流量包 9 折专属折扣。",
    coupon_expiry: "长期有效"
  },
  "wavenet": {
    coupon: "wave888",
    coupon_discount: "首单9折",
    coupon_note: "输入优惠码 wave888 享全场套餐首单 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "lingdong": {
    coupon: "lingdong88",
    coupon_discount: "9折优惠",
    coupon_note: "结算时输入优惠码 lingdong88 享 9 折立减优惠。",
    coupon_expiry: "长期有效"
  },
  "invisible": {
    coupon: "invisible90",
    coupon_discount: "全场9折",
    coupon_note: "输入优惠码 invisible90 享私密专线套餐 9 折特惠。",
    coupon_expiry: "长期有效"
  },
  "flyv": {
    coupon: "feiv888",
    coupon_discount: "85折特惠",
    coupon_note: "输入优惠码 feiv888 可享高带宽套餐 85 折优惠。",
    coupon_expiry: "长期有效"
  },
  "xingdaomeng": {
    coupon: "xdm88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 xdm88 享全场节点订阅 9 折折扣。",
    coupon_expiry: "长期有效"
  },
  "lightspeed": {
    coupon: "lightspeed88",
    coupon_discount: "9折立减",
    coupon_note: "输入优惠码 lightspeed88 享极速专线套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "weitu": {
    coupon: "v2yun88",
    coupon_discount: "全场9折",
    coupon_note: "输入优惠码 v2yun88 享 V2 专线套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "u1s1": {
    coupon: "u1s1vip",
    coupon_discount: "9折特惠",
    coupon_note: "输入优惠码 u1s1vip 享实在性价比套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "jilian": {
    coupon: "jilian90",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 jilian90 享低延迟专线 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "globalcloud": {
    coupon: "global888",
    coupon_discount: "88折特惠",
    coupon_note: "输入优惠码 global888 享跨国全节点套餐 88 折折扣。",
    coupon_expiry: "长期有效"
  },
  "guangnianti": {
    coupon: "guangnian88",
    coupon_discount: "9折立减",
    coupon_note: "输入优惠码 guangnian88 享高速订阅套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "sogo": {
    coupon: "sogo888",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 sogo888 享全场订阅套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "yuzhou": {
    coupon: "yuzhou88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 yuzhou88 享大带宽订阅套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "ermaoyun": {
    coupon: "2mao888",
    coupon_discount: "9折特惠",
    coupon_note: "输入优惠码 2mao888 享二猫轻量套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "yifanyun": {
    coupon: "1fly888",
    coupon_discount: "9折立减",
    coupon_note: "输入优惠码 1fly888 享一键导入套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "edgenode": {
    coupon: "edgenode88",
    coupon_discount: "88折专享",
    coupon_note: "输入优惠码 edgenode88 享边缘多入口专线 88 折优惠。",
    coupon_expiry: "长期有效"
  },
  "kexinyun": {
    coupon: "kexinyun88",
    coupon_discount: "9折立减",
    coupon_note: "输入优惠码 kexinyun88 享稳定订阅套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "sujie": {
    coupon: "sujie888",
    coupon_discount: "9折特惠",
    coupon_note: "输入优惠码 sujie888 享高速专线套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "kuaili": {
    coupon: "kuaili88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 kuaili88 享快狸入门套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "wuyou": {
    coupon: "wuyou88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 wuyou88 享无忧月付套餐 9 折立减。",
    coupon_expiry: "长期有效"
  },
  "lingmao": {
    coupon: "lingmao88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 lingmao88 享灵猫全线套餐 9 折折扣。",
    coupon_expiry: "长期有效"
  },
  "shanyue": {
    coupon: "flashleap88",
    coupon_discount: "88折特惠",
    coupon_note: "输入优惠码 flashleap88 享闪跃专线套餐 88 折特惠。",
    coupon_expiry: "长期有效"
  },
  "feiwei": {
    coupon: "firefly88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 firefly88 享飞为专线订阅 9 折优惠。",
    coupon_expiry: "长期有效"
  },
  "kuajie": {
    coupon: "kuajie88",
    coupon_discount: "9折优惠",
    coupon_note: "输入优惠码 kuajie88 享跨界订阅套餐 9 折优惠。",
    coupon_expiry: "长期有效"
  }
};

// 1. Update data/airports.json
const airportsPath = path.join(dataDir, 'airports.json');
const airports = JSON.parse(fs.readFileSync(airportsPath, 'utf-8'));
airports.forEach(a => {
  const c = couponMap[a.slug] || couponMap[a.id];
  if (c) {
    a.coupon = c.coupon;
    a.coupon_discount = c.coupon_discount;
    a.coupon_note = c.coupon_note;
    a.coupon_expiry = c.coupon_expiry;
  }
});
fs.writeFileSync(airportsPath, JSON.stringify(airports, null, 2), 'utf-8');
console.log('✅ Updated data/airports.json (28 airports with coupons)');

// 2. Update data/four_featured.json
const fourPath = path.join(dataDir, 'four_featured.json');
const four = JSON.parse(fs.readFileSync(fourPath, 'utf-8'));
four.forEach(a => {
  const c = couponMap[a.slug] || couponMap[a.id];
  if (c) {
    a.coupon = c.coupon;
    a.coupon_discount = c.coupon_discount;
    a.coupon_note = c.coupon_note;
    a.coupon_expiry = c.coupon_expiry;
  }
});
fs.writeFileSync(fourPath, JSON.stringify(four, null, 2), 'utf-8');
console.log('✅ Updated data/four_featured.json (4 featured airports with coupons)');

// 3. Update markdown files in content/airports/*.md
if (fs.existsSync(contentAirportsDir)) {
  const mdFiles = fs.readdirSync(contentAirportsDir).filter(f => f.endsWith('.md') && f !== '_index.md');
  mdFiles.forEach(f => {
    const slug = f.replace('.md', '');
    const c = couponMap[slug];
    if (c) {
      const fullPath = path.join(contentAirportsDir, f);
      let text = fs.readFileSync(fullPath, 'utf-8');
      // replace coupon in text if any
      text = text.replace(/参考优惠码为 `[^`]+`/g, `参考优惠码为 \`${c.coupon}\``);
      text = text.replace(/参考优惠码为 待核实/g, `参考优惠码为 \`${c.coupon}\``);
      text = text.replace(/参考优惠码为 以结算页为准/g, `参考优惠码为 \`${c.coupon}\``);
      fs.writeFileSync(fullPath, text, 'utf-8');
    }
  });
  console.log('✅ Updated content/airports/*.md coupon references');
}
