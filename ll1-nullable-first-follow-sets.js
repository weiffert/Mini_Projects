function nullable(g) {
    // Seed Object
    const nullableSet = {};
    Object.keys(g).forEach(nonTerminal => {
        nullableSet[nonTerminal] = false;
    });

    let change = true;
    while (change) {
        change = false;
        for(const [nonTerminal, rhss] of Object.entries(g)) {
            // If not already nullable
            if (!nullableSet[nonTerminal]) {
                // For each production rule
                rhss.forEach(rhs => {
                    // console.log(`${nonTerminal} -> ${rhs.join(" ")}`);
                    // If all items are nullable within the rule rhs
                    if (rhs.reduce((accumulator, value) => {
                        return accumulator && nullableSet[value];
                    }, true)) {
                        change = true;
                        nullableSet[nonTerminal] = true;
                    }
                });
            }
        }
    }

    return nullableSet;
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function first(g, nullable) {
    // Seed object
    const firstSet = {};
    Object.keys(g).forEach(nonTerminal => {
        firstSet[nonTerminal] = new Set();
    });

    let change = true;
    while(change) {
        change = false;
        for(const [nonTerminal, rhss] of Object.entries(g)) {
            rhss.forEach(rhs => {
                // If rule is not empty
                if (rhs.length > 0) {
                    // console.log(`${nonTerminal} -> ${rhs.join(" ")}`);
                    const size = firstSet[nonTerminal].size; 
                    let index = 0;
                    do {
                        const curr = rhs[index];
                        // console.log(`Current: ${curr}`);
                        if (firstSet[curr]) {
                            firstSet[nonTerminal] = union(firstSet[nonTerminal], firstSet[curr]);
                        } else {
                            firstSet[nonTerminal].add(curr);
                        }
                        index++;
                        // Repeat on next item only if the item is nullable, and there is a next item.
                    } while(index < rhs.length && nullable[rhs[index - 1]]);

                    if (firstSet[nonTerminal].size != size) {
                        change = true;
                    }
                }
            });
        }
    }

    return firstSet;
}

function follow(g, nullSet, firstSet, startTerm) {
    // Seed object
    const followSet = {};
    Object.keys(g).forEach(nonTerminal => {
        followSet[nonTerminal] = new Set();
    });
    followSet[startTerm].add('$');

    let change = true;
    while(change) {
        change = false;
        for(const [nonTerminal, rhss] of Object.entries(g)) {
            rhss.forEach(rhs => {
                // console.log(`${nonTerminal} -> ${rhs.join(" ")}`);
                rhs.forEach((token, index) => {
                    // If the token is a non terminal
                    if (followSet[token]) {
                        const size = followSet[token].size;
                        // If there is a tail beta
                        if (index + 1 < rhs.length) {
                            console.log(`FollowSet ${token} union FirstSet ${rhs[index + 1]}`);
                            // If beta is a non terminal
                            if (firstSet[rhs[index + 1]]) {
                                followSet[token] = union(followSet[token], firstSet[rhs[index + 1]]);
                            } else {
                                followSet[token].add(rhs[index + 1])
                            }
                            // if rest of rhs is nullable.
                            if(rhs.slice(index + 1).reduce((accumulator, curr) => {
                                return accumulator && nullSet[curr];
                            }, true)) {
                                console.log(`FollowSet ${token} union FollowSet ${nonTerminal}`);
                                followSet[token] = union(followSet[token], followSet[nonTerminal]);
                            }
                        } else {
                            console.log(`FollowSet ${token} union FollowSet ${nonTerminal}`);
                            followSet[token] = union(followSet[token], followSet[nonTerminal]);
                        }

                        if (size != followSet[token].size) {
                            change = true;
                        }
                    }
                });
            });
        }
    }

    return followSet;
}
