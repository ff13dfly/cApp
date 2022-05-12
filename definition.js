//blog anchor application data struct
const blog = {
    "title": "blog title",
    "content": "",
    "link": "url",
    "ref": "anchor", //可以关联到其他的anchro，覆盖关系。设置了这个之后，可以显示为#ref#
}

//blog list
const data = {
    list: ["anchor_a", "anchor_b", "anchor_c"],
};

const twitter = {
    "content": "",
    "ref": "anchor", //关联的anchor，可以把话题组织起来
    "std": "twitter",
};