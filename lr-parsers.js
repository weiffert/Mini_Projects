function parseStatement(table, statement) {
    console.log("Assumes no conflicts");
    const stack = [0];
    const log = [addLogItem('Initial', stack, statement)];
    let doneParsing = false;
    let token = statement[0];
    while(!doneParsing) {
        let action = table[stack[stack.length - 1]][token];
        action = [...action][0];

        if (action === undefined) {
            log.push(addLogItem(`Reject`, stack, statement))
            doneParsing = true;
        }
        else {
            action = action.trim();
            if (action.indexOf("=>") >= 0) {
                const sides = action.split("=>");
                const lhs = sides[0].trim();
                const rhs = sides[1].trim() !== "" ? sides[1].trim().split(" ") : [];
                rhs.forEach(a => stack.pop());
                const stateNumber = [...table[stack[stack.length - 1]][lhs]][0];
                if (stateNumber === undefined) {
                    console.log(lhs);
                    console.log(stack);
                    console.log(table[stack[stack.length - 1]][lhs]);
                    log.push(addLogItem(`Reject`, stack, statement))
                    doneParsing = true;
                } else {
                    const gotoSides = stateNumber.split(" ");
                    const number = gotoSides[1];
                    stack.push(number);
                    log.push(addLogItem(`Reduce ${action}; ${stateNumber}`, stack, statement));
                }
            } else if (action.indexOf("Shift") >= 0) {
                const sides = action.trim().split(" ");
                const stateNumber = sides[1];
                stack.push(stateNumber);
                log.push(addLogItem(action, stack, statement));
                statement.splice(0, 1);
                token = statement[0];
            } else if (action.indexOf("Accept" >= 0)) {
                doneParsing = true;
                if (statement.length === 1) {
                    log.push(addLogItem(`Accept`, stack, statement))
                } else {
                    log.push(addLogItem(`Reject`, stack, statement))
                }
            }
        }
    }
    console.table(log);
}

function addLogItem(action, stack, remainingInput) {
    // console.log(`${action}: ${stack.join(" ")}: ${remainingInput.join(" ")}`);
    return {
        action,
        stack: stack.join(" "),
        remaining_input: remainingInput.join(" ")
    }
}

function categorizeGrammar(grammar, start) {
    const [states, isLR0] = createLR0StateDiagram(grammar, start);
    const [ nonterminals, terminals ] = categorizeTokens(grammar, start);
    if (isLR0) {
        console.log('isLR0');
        const table = generateLR0_Table(states, nonterminals, terminals, start)
        printStates(states);
        printLRTable(table, terminals, nonterminals);
        return table;
    } else {
        const [ nullableSet, firstSet, followSet ] = findSets(grammar, start);
        const [table, isSLR] = generateSLR_Table(states, nonterminals, terminals, followSet, start)
        if (isSLR) {
            console.log('isSLR');
            printStates(states);
            printLRTable(table, terminals, nonterminals);
            return table;
        } else {
            const lalr_states = createLALRStateDiagram(grammar, start);
            const [lalr_table, isLALR] = generateLALR_Table(lalr_states, nonterminals, terminals)
            console.log(`isLALR: ${isLALR}`);
            printLALRStates(states);
            printLRTable(lalr_table, terminals, nonterminals);
            return lalr_table;
        }
    }
}

function createLL1(grammar) {
    const nSet = nullable(grammar);
    const firstSet = first(grammar, nSet);
    const followSet = follow(grammar, nSet, firstSet);
}

function createLR0(grammar, start) {
    const [states, isLR0] = createLR0StateDiagram(grammar, start);
    const [ nonterminals, terminals ] = categorizeTokens(grammar, start);
    const table = generateLR0_Table(states, nonterminals, terminals, start)
    console.log(`isLR0: ${isLR0}`);
    printStates(states);
    printLRTable(table, terminals, nonterminals);
}

function createSLR(grammar, start) {
    const [states, isLR0] = createLR0StateDiagram(grammar, start);
    const [ nonterminals, terminals ] = categorizeTokens(grammar, start);
    const [ nullableSet, firstSet, followSet ] = findSets(grammar, start);
    const [table, isSLR] = generateSLR_Table(states, nonterminals, terminals, followSet, start);
    console.log(`isLR0: ${isLR0}`);
    console.log(`isSLR: ${isSLR}`);
    printStates(states);
    printLRTable(table, terminals, nonterminals);
}

function createLALR(grammar) {
    const states = createLALRStateDiagram(grammar);
    const [ nonterminals, terminals ] = categorizeTokens(grammar, start);
    const [table, isLALR] = generateLALR_Table(states, nonterminals, terminals)
    console.log(`isLALR: ${isLALR}`);
    printLALRStates(states);
    printLRTable(table, terminals, nonterminals);
}

function printStates(states) {
    console.table(states.map(state => {
        return {
            state: `I${state.number}`,
            items: state.items.map(item => {
                const cpy = [...item.rhs];
                cpy.splice(item.index, 0, ".");
                return `${item.lhs} => ${cpy.join(" ")}`;
            }).join("\n"),
            actions: state.items.map(item => `${item.action.map(a => a.type === "Shift" ? `Goto[I${state.number}, ${a.token}] = I${a.state}` : `${a.type} ${a.token} => ${a.state.join(' ')}`).join(',')}`).join('\n')
        }
    }));
}

function printLALRStates(states) {
    console.table(states.map(state => {
        return {
            state: `I${state.number}`,
            items: state.items.map(item => {
                const cpy = [...item.rhs];
                cpy.splice(item.index, 0, ".");
                return `${item.lhs} => ${cpy.join(" ")}`;
            }).join("\n"),
            lookahead: state.items.map(item => `{${item.lookahead.join(', ')}}`).join("\n"),
            actions: state.items.map(item => `${item.action.map(a => a.type === "Shift" ? `Goto[I${state.number}, ${a.token}] = I${a.state}` : `${a.type} ${a.token} => ${a.state.join(' ')}`).join(',')}`).join('\n')
        }
    }));
}

function printLRTable(table, terminals, nonterminals) {
    const actions = [...table];
    console.table(actions.map(action => {
        action = {...action};
        for(let t of [...terminals, ...nonterminals]) {
            if (action[t].size === 0) {
                action[t] = " ";
            } else {
                action[t] = [...action[t]].join(",");
            }
        }
        return action;
    }));
}

function generateLR0_Table(states, nonterminals, terminals, start) {
    const allActions = [];
    states.forEach(state => {
        const actions = {};
        for (let t of [...nonterminals, ...terminals]) {
            actions[t] = new Set();
        }
        for(let t of terminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === t) {
                        actions[t].add(`Shift ${action.state}`);
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === n) {
                        actions[n].add(`Goto ${action.state}`);
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Reduce' && action.token === n) {
                        if (n === start) {
                            actions['$'].add(`Accept`);
                        }
                        else {
                            for (let t of terminals) {
                                actions[t].add(`${item.lhs} => ${action.state.join(" ")}`);
                            }
                        }
                    }
                })
            })
        }
        
        allActions.push(actions);
    });

    console.table(allActions);
    return allActions;
}

function generateSLR_Table(states, nonterminals, terminals, followSet, start) {
    const allActions = [];
    let isSLR = true;
    states.forEach(state => {
        const actions = {};
        for (let t of [...nonterminals, ...terminals]) {
            actions[t] = new Set();
        }
        for(let t of terminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === t) {
                        actions[t].add(`Shift ${action.state}`);
                        if (actions[t].size != 1) {
                            isSLR = false;
                        }
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === n) {
                        actions[n].add(`Goto ${action.state}`);
                        if (actions[n].size != 1) {
                            isSLR = false;
                        }
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Reduce' && action.token === n) {
                        followSet[item.lhs].forEach(token => {
                            if (token === '$' && action.token === start) {
                                actions[token].add("Accept");
                            } else {
                                actions[token].add(`${item.lhs} => ${action.state.join(" ")}`);
                            }
                            if (actions[token].size != 1) {
                                isSLR = false;
                            }
                        });
                    }
                })
            })
        }

        allActions.push(actions);
    });

    return [ allActions, isSLR ];
}

function generateLALR_Table(states, nonterminals, terminals) {
    const allActions = [];
    let isLALR = true;
    states.forEach(state => {
        const actions = {};
        for (let t of [...nonterminals, ...terminals]) {
            actions[t] = new Set();
        }
        for(let t of terminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === t) {
                        actions[t].add(`S${action.state}`);
                        if (actions[t].size != 1) {
                            isLALR = false;
                        }
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Shift' && action.token === n) {
                        actions[n].add(`G${action.state}`);
                        if (actions[n].size != 1) {
                            isLALR = false;
                        }
                    }
                })
            })
        }
        for(let n of nonterminals) {
            state.items.forEach(item => {
                item.action.forEach(action => {
                    if (action.type === 'Reduce' && action.token === n) {
                        item.lookahead.forEach(token => {
                            actions[token].add(`${item.lhs} => "${action.state.join(" ")}"`);
                            if (actions[token].size != 1) {
                                isLALR = false;
                            }
                        });
                    }
                })
            })
        }

        allActions.push(actions);
    });

    return [ allActions, isLALR ];
}

function categorizeTokens(grammar, start) {
    const nonterminals = new Set();
    const terminals = new Set();
    for(let [key, rules] of Object.entries(grammar)) {
        rules.forEach(rule => {
            rule.forEach(token => {
                if (grammar[token]) {
                    nonterminals.add(token);
                }
                else {
                    terminals.add(token);
                }
            });
        })
    }
    nonterminals.add(start);
    terminals.add('$');

    console.log(nonterminals);
    console.log(terminals);

    return [nonterminals, terminals];
}

function findSets(grammar, start) {
    const [nullSet, nullSets] = nullable(grammar);
    const [firstSet, firstSets] = first(grammar, nullSet);
    const [followSet, followSets] = follow(grammar, nullSet, firstSet, start);
    console.log("nullSet");
    console.log(nullSet);
    console.log("firstSet");
    console.log(firstSet);
    console.log("followSet");
    console.log(followSet);
    return [nullSet, firstSet, followSet];
}

function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

function nullable(g) {
    // Seed Object
    const sets = [];
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
        sets.push({...nullableSet});
    }

    return [nullableSet, sets];
}

function first(g, nullable) {
    // Seed object
    const sets = [];
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
                    const size = firstSet[nonTerminal].size; 
                    let index = 0;
                    do {
                        const curr = rhs[index];
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
        sets.push({...firstSet});
    }

    return [firstSet, sets];
}

function follow(g, nullSet, firstSet, startTerm) {
    // Seed object
    const sets = [];
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
                rhs.forEach((token, index) => {
                    // If the token is a non terminal
                    if (followSet[token]) {
                        const size = followSet[token].size;
                        // If there is a tail beta
                        if (index + 1 < rhs.length) {
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
                                followSet[token] = union(followSet[token], followSet[nonTerminal]);
                            }
                        } else {
                            followSet[token] = union(followSet[token], followSet[nonTerminal]);
                        }

                        if (size != followSet[token].size) {
                            change = true;
                        }
                    }
                });
            });
        }
        sets.push({...followSet});
    }

    return [followSet, sets];
}


function createLR0Item(lhs, rhs) {
    return {
        lhs,
        rhs,
        index: 0,
        completed: false,
        action: []
    }
}

function createLALRItem(lhs, rhs) {
    return {
        ...createLR0Item(lhs, rhs),
        lookahead: []
    };
}

function copyItem(item) {
    const copy = {...item};
    copy.action = [...copy.action];
    return copy;
}

function copyLALRItem(item) {
    const copy = copyItem(item);
    copy.lookahead = [...copy.lookahead];
    return copy;
}

function createState(number, items) {
    return {
        number,
        items
    };
}

function createClosure(grammar, items) {
    let change = true;
    const closure = [];
    items.forEach(item => {
        closure.push(item);
    });

    while (change) {
        change = false;
        closure.forEach(item => {
            if (item.index == item.rhs.length) {
                item.completed = true;
            } else {
                const lhs = item.rhs[item.index];
                const rhss = grammar[lhs];
                if (rhss) {
                    rhss.forEach(rhs => {
                        const lr0Item = createLR0Item(lhs, rhs);
                        let found = false;
                        for (item of closure) {
                            if (equalItem(item, lr0Item)) {
                                found = true;
                            }
                        } 
                        if (!found) {
                            closure.push(createLR0Item(lhs, rhs));
                            change = true;
                        }
                    });
                }
            }
        });
    }

    return closure;
}

function equalItem(a, b) {
    return a.lhs === b.lhs && a.rhs === b.rhs && a.index === b.index;
}

function equalLR0States(a, b) {
    return subsetLR0States(a, b) && subsetLR0States(b, a);
}

function subsetLR0States(a, b) {
    for(let itemA of a.items) {
        let found = false;
        for(let itemB of b.items) {
            if (equalItem(itemA, itemB)) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

function createLR0StateDiagram(grammar, start) {
    let stateCount = 1;
    const state0 = createState(0, createClosure(grammar, grammar[start].map(rule => createLR0Item(start, rule))));
    const worklist = [ state0 ];
    const states = [ state0 ];
    let isLR0 = true;
    while (worklist.length != 0) {
        if (stateCount > 100) {
            console.log("overflow");
            return [states, isLR0];
        }
        let state = worklist.splice(0, 1)[0];
        
        let reductionItems = 0;
        let shiftItems = 0;
        let shifts = {old: {}, new: {}};
        state.items.forEach(item => {
            if (item.completed) {
                reductionItems += 1;
                item.action.push({type:'Reduce', token:item.lhs, state:item.rhs});
            } else {
                shiftItems += 1;
                let shift = item.rhs[item.index];
                let nextItem = copyItem(item);
                nextItem.index++;
                if (shifts.old[shift] === undefined) {
                    shifts.old[shift] = [];
                    shifts.new[shift] = [];
                } 
                shifts.old[shift].push(item);
                shifts.new[shift].push(nextItem);
            }
        });
        for(let [key, items] of Object.entries(shifts.new)) {
            let newState = createState(stateCount, createClosure(grammar, items));
            let goto = stateCount;
            let repeatState = states.find(s => equalLR0States(s, newState));
            if (repeatState) {
                goto = repeatState.number;
            } else {
                stateCount++;
                states.push(newState);
                worklist.push(newState);
            }
            shifts.old[key].forEach(item => {
                item.action.push({type:'Shift', token:key, state:goto});
            });
        }

        if (reductionItems > 1 || reductionItems > 0 && shiftItems > 0) {
            isLR0 = false;
        }
    }

    return [states, isLR0];
}

function createLALRStateDiagram(grammar) {

}
