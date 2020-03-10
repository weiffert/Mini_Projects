class Tree {
    constructor(weight) {
        this.weight = weight;
        this.with = 0;
        this.without = 0;
        this.L = [];
    }
}

function dc(tree) {
    let below = 0;
    let below2 = tree.weight;
    tree.L.forEach((child) => {
        let res = dc(child);
        print(res)
        below += res[0]; 
        below2 += res[1];
    })
    return [below > below2 ? below: below2, below];
}

function subset(tree) {
    let below = 0;
    let below2 = tree.weight;
    tree.L.forEach((child) => {
        below += child.with;
        below2 += child.without;
    })
    tree.with = below > below2 ? below: below2;
    tree.without = below;
}

function traversal(tree, func) {
    tree.L.forEach(child => traversal(child));
    subset(tree);
}

let rt = new Tree(1);
for(let i = 0; i < 5; i++) {
    let layer1 = new Tree(1);
    let num = i == 0 ? 5 : i == 4 ? 5 : 0;
    for(let j = 0; j < num; j++) {
        let layer2 = new Tree(1);
        //for (let k = j; k < 5; k++) {
            //let layer3 = new Tree(1);
            //layer2.L.push(layer3);
        //}
        layer1.L.push(layer2);
    }
    rt.L.push(layer1);
}

traversal(rt, subset);
console.log(rt.with);
dc(rt);