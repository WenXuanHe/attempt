function createElement(node){
    if(typeof node === 'string'){
        return document.createTextNode(node);
    }
    const $el = document.createElement(node.type);
    node.children
    .map(createElement)
    .forEach($el.appendChild.bind($el));
}

function updateElement($parent, newNode, oldNode, index = 0){
    if(!oldNode){
        // 新增节点
        $parent.appendChild(createElement(newNode));
    }else if(!newNode){
        // 删除节点
        $parent.removeChild(
            $parent.childNodes[index]
          );
    }else if(changed(newNode, oldNode)){
        // 替换
        $parent.replaceChild(
            createElement(newNode),
            $parent.childNodes[index]
          );
    }else{
         // 按层比较
         const newLength = newNode.children.length;
         const oldLength = oldNode.children.length;

         for(let i = 0; i < (newLength || oldLength); i++){
             updateElement(
                 $parent.childNodes[index],
                 newNode.children[i],
                 oldNode.children[i],
                 i
               );
         }
    }

}

/**
 * 节点是否改变
 * @param {*} node1
 * @param {*} node2
 */
function changed(node1, node2){
    return typeof node1 !== typeof node2 ||
    typeof node1 === "string" && node1 !== node2 ||
    node1.type !== node2.type
}

function h(type, props, …children) {
  return { type, props, children };
}

// { type: ‘…’, props: { … }, children: [ … ] }
