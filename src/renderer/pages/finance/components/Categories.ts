const categoryMap = {
  lingshou: '零售',
  canyin: '餐饮',
  gouwu: '购物',
  riyong: '日用',
  jiaotong: '交通',
  shucai: '蔬菜',
  shuiguo: '水果',
  lingshi: '零食',
  yundong: '运动',
  yule: '娱乐',
  tongxun: '通讯',
  fushi: '服饰',
  meirong: '美容',
  zhufang: '住房',
  jujia: '居家',
  haizi: '孩子',
  zhangbei: '长辈',
  shejiao: '社交',
  lvxing: '旅行',
  yanjiu: '烟酒',
  shuma: '数码',
  qiche: '汽车',
  yiliao: '医疗',
  shuji: '书籍',
  xuexi: '学习',
  chongwu: '宠物',
  lijin: '礼金',
  liwu: '礼物',
  bangong: '办公',
  weixiu: '维修',
  juanzeng: '捐赠',
  caipiao: '彩票',
  qinyou: '亲友',
  kuaidi: '快递',
};

export const getLabelByValue = (value: string) => {
  return categoryMap[value] || '未知';
};

const genCategories = () => {
  const categories: Array<{ label: string; value: string }> = [];
  for (const category in categoryMap) {
    categories.push({
      label: categoryMap[category],
      value: category,
    });
  }

  return categories;
};

export default genCategories();
