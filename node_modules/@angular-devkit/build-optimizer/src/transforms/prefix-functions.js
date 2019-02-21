"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
const ast_utils_1 = require("../helpers/ast-utils");
function getPrefixFunctionsTransformer() {
    return (context) => {
        const transformer = (sf) => {
            const topLevelFunctions = findTopLevelFunctions(sf);
            const visitor = (node) => {
                // Add pure function comment to top level functions.
                if (topLevelFunctions.has(node)) {
                    const newNode = ast_utils_1.addPureComment(node);
                    // Replace node with modified one.
                    return ts.visitEachChild(newNode, visitor, context);
                }
                // Otherwise return node as is.
                return ts.visitEachChild(node, visitor, context);
            };
            return ts.visitNode(sf, visitor);
        };
        return transformer;
    };
}
exports.getPrefixFunctionsTransformer = getPrefixFunctionsTransformer;
function findTopLevelFunctions(parentNode) {
    const topLevelFunctions = new Set();
    function cb(node) {
        // Stop recursing into this branch if it's a definition construct.
        // These are function expression, function declaration, class, or arrow function (lambda).
        // The body of these constructs will not execute when loading the module, so we don't
        // need to mark function calls inside them as pure.
        // Class static initializers in ES2015 are an exception we don't cover. They would need similar
        // processing as enums to prevent property setting from causing the class to be retained.
        if (ts.isFunctionDeclaration(node)
            || ts.isFunctionExpression(node)
            || ts.isClassDeclaration(node)
            || ts.isArrowFunction(node)
            || ts.isMethodDeclaration(node)) {
            return;
        }
        let noPureComment = !ast_utils_1.hasPureComment(node);
        let innerNode = node;
        while (innerNode && ts.isParenthesizedExpression(innerNode)) {
            innerNode = innerNode.expression;
            noPureComment = noPureComment && !ast_utils_1.hasPureComment(innerNode);
        }
        if (!innerNode) {
            return;
        }
        if (noPureComment) {
            if (ts.isNewExpression(innerNode)) {
                topLevelFunctions.add(node);
            }
            else if (ts.isCallExpression(innerNode)) {
                let expression = innerNode.expression;
                while (expression && ts.isParenthesizedExpression(expression)) {
                    expression = expression.expression;
                }
                if (expression) {
                    if (ts.isFunctionExpression(expression)) {
                        // Skip IIFE's with arguments
                        // This could be improved to check if there are any references to variables
                        if (innerNode.arguments.length === 0) {
                            topLevelFunctions.add(node);
                        }
                    }
                    else {
                        topLevelFunctions.add(node);
                    }
                }
            }
        }
        ts.forEachChild(innerNode, cb);
    }
    ts.forEachChild(parentNode, cb);
    return topLevelFunctions;
}
exports.findTopLevelFunctions = findTopLevelFunctions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LWZ1bmN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy90cmFuc2Zvcm1zL3ByZWZpeC1mdW5jdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFDakMsb0RBQXNFO0FBRXRFLFNBQWdCLDZCQUE2QjtJQUMzQyxPQUFPLENBQUMsT0FBaUMsRUFBaUMsRUFBRTtRQUMxRSxNQUFNLFdBQVcsR0FBa0MsQ0FBQyxFQUFpQixFQUFFLEVBQUU7WUFFdkUsTUFBTSxpQkFBaUIsR0FBRyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVwRCxNQUFNLE9BQU8sR0FBZSxDQUFDLElBQWEsRUFBVyxFQUFFO2dCQUNyRCxvREFBb0Q7Z0JBQ3BELElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMvQixNQUFNLE9BQU8sR0FBRywwQkFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUVyQyxrQ0FBa0M7b0JBQ2xDLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2lCQUNyRDtnQkFFRCwrQkFBK0I7Z0JBQy9CLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELENBQUMsQ0FBQztZQUVGLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRUYsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXhCRCxzRUF3QkM7QUFFRCxTQUFnQixxQkFBcUIsQ0FBQyxVQUFtQjtJQUN2RCxNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFXLENBQUM7SUFFN0MsU0FBUyxFQUFFLENBQUMsSUFBYTtRQUN2QixrRUFBa0U7UUFDbEUsMEZBQTBGO1FBQzFGLHFGQUFxRjtRQUNyRixtREFBbUQ7UUFDbkQsK0ZBQStGO1FBQy9GLHlGQUF5RjtRQUN6RixJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUM7ZUFDN0IsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQztlQUM3QixFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDO2VBQzNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO2VBQ3hCLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsRUFDL0I7WUFDQSxPQUFPO1NBQ1I7UUFFRCxJQUFJLGFBQWEsR0FBRyxDQUFDLDBCQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE9BQU8sU0FBUyxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzRCxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUNqQyxhQUFhLEdBQUcsYUFBYSxJQUFJLENBQUMsMEJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUM3RDtRQUVELElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxPQUFPO1NBQ1I7UUFFRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ2pDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM3QjtpQkFBTSxJQUFJLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDekMsSUFBSSxVQUFVLEdBQWtCLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQ3JELE9BQU8sVUFBVSxJQUFJLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDN0QsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7aUJBQ3BDO2dCQUNELElBQUksVUFBVSxFQUFFO29CQUNkLElBQUksRUFBRSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxFQUFFO3dCQUN2Qyw2QkFBNkI7d0JBQzdCLDJFQUEyRTt3QkFDM0UsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7NEJBQ3BDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQzt5QkFDN0I7cUJBQ0Y7eUJBQU07d0JBQ0wsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUM3QjtpQkFDRjthQUNGO1NBQ0Y7UUFFRCxFQUFFLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFaEMsT0FBTyxpQkFBaUIsQ0FBQztBQUMzQixDQUFDO0FBMURELHNEQTBEQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHsgYWRkUHVyZUNvbW1lbnQsIGhhc1B1cmVDb21tZW50IH0gZnJvbSAnLi4vaGVscGVycy9hc3QtdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJlZml4RnVuY3Rpb25zVHJhbnNmb3JtZXIoKTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+IHtcbiAgcmV0dXJuIChjb250ZXh0OiB0cy5UcmFuc2Zvcm1hdGlvbkNvbnRleHQpOiB0cy5UcmFuc2Zvcm1lcjx0cy5Tb3VyY2VGaWxlPiA9PiB7XG4gICAgY29uc3QgdHJhbnNmb3JtZXI6IHRzLlRyYW5zZm9ybWVyPHRzLlNvdXJjZUZpbGU+ID0gKHNmOiB0cy5Tb3VyY2VGaWxlKSA9PiB7XG5cbiAgICAgIGNvbnN0IHRvcExldmVsRnVuY3Rpb25zID0gZmluZFRvcExldmVsRnVuY3Rpb25zKHNmKTtcblxuICAgICAgY29uc3QgdmlzaXRvcjogdHMuVmlzaXRvciA9IChub2RlOiB0cy5Ob2RlKTogdHMuTm9kZSA9PiB7XG4gICAgICAgIC8vIEFkZCBwdXJlIGZ1bmN0aW9uIGNvbW1lbnQgdG8gdG9wIGxldmVsIGZ1bmN0aW9ucy5cbiAgICAgICAgaWYgKHRvcExldmVsRnVuY3Rpb25zLmhhcyhub2RlKSkge1xuICAgICAgICAgIGNvbnN0IG5ld05vZGUgPSBhZGRQdXJlQ29tbWVudChub2RlKTtcblxuICAgICAgICAgIC8vIFJlcGxhY2Ugbm9kZSB3aXRoIG1vZGlmaWVkIG9uZS5cbiAgICAgICAgICByZXR1cm4gdHMudmlzaXRFYWNoQ2hpbGQobmV3Tm9kZSwgdmlzaXRvciwgY29udGV4dCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcndpc2UgcmV0dXJuIG5vZGUgYXMgaXMuXG4gICAgICAgIHJldHVybiB0cy52aXNpdEVhY2hDaGlsZChub2RlLCB2aXNpdG9yLCBjb250ZXh0KTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiB0cy52aXNpdE5vZGUoc2YsIHZpc2l0b3IpO1xuICAgIH07XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtZXI7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kVG9wTGV2ZWxGdW5jdGlvbnMocGFyZW50Tm9kZTogdHMuTm9kZSk6IFNldDx0cy5Ob2RlPiB7XG4gIGNvbnN0IHRvcExldmVsRnVuY3Rpb25zID0gbmV3IFNldDx0cy5Ob2RlPigpO1xuXG4gIGZ1bmN0aW9uIGNiKG5vZGU6IHRzLk5vZGUpIHtcbiAgICAvLyBTdG9wIHJlY3Vyc2luZyBpbnRvIHRoaXMgYnJhbmNoIGlmIGl0J3MgYSBkZWZpbml0aW9uIGNvbnN0cnVjdC5cbiAgICAvLyBUaGVzZSBhcmUgZnVuY3Rpb24gZXhwcmVzc2lvbiwgZnVuY3Rpb24gZGVjbGFyYXRpb24sIGNsYXNzLCBvciBhcnJvdyBmdW5jdGlvbiAobGFtYmRhKS5cbiAgICAvLyBUaGUgYm9keSBvZiB0aGVzZSBjb25zdHJ1Y3RzIHdpbGwgbm90IGV4ZWN1dGUgd2hlbiBsb2FkaW5nIHRoZSBtb2R1bGUsIHNvIHdlIGRvbid0XG4gICAgLy8gbmVlZCB0byBtYXJrIGZ1bmN0aW9uIGNhbGxzIGluc2lkZSB0aGVtIGFzIHB1cmUuXG4gICAgLy8gQ2xhc3Mgc3RhdGljIGluaXRpYWxpemVycyBpbiBFUzIwMTUgYXJlIGFuIGV4Y2VwdGlvbiB3ZSBkb24ndCBjb3Zlci4gVGhleSB3b3VsZCBuZWVkIHNpbWlsYXJcbiAgICAvLyBwcm9jZXNzaW5nIGFzIGVudW1zIHRvIHByZXZlbnQgcHJvcGVydHkgc2V0dGluZyBmcm9tIGNhdXNpbmcgdGhlIGNsYXNzIHRvIGJlIHJldGFpbmVkLlxuICAgIGlmICh0cy5pc0Z1bmN0aW9uRGVjbGFyYXRpb24obm9kZSlcbiAgICAgIHx8IHRzLmlzRnVuY3Rpb25FeHByZXNzaW9uKG5vZGUpXG4gICAgICB8fCB0cy5pc0NsYXNzRGVjbGFyYXRpb24obm9kZSlcbiAgICAgIHx8IHRzLmlzQXJyb3dGdW5jdGlvbihub2RlKVxuICAgICAgfHwgdHMuaXNNZXRob2REZWNsYXJhdGlvbihub2RlKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBub1B1cmVDb21tZW50ID0gIWhhc1B1cmVDb21tZW50KG5vZGUpO1xuICAgIGxldCBpbm5lck5vZGUgPSBub2RlO1xuICAgIHdoaWxlIChpbm5lck5vZGUgJiYgdHMuaXNQYXJlbnRoZXNpemVkRXhwcmVzc2lvbihpbm5lck5vZGUpKSB7XG4gICAgICBpbm5lck5vZGUgPSBpbm5lck5vZGUuZXhwcmVzc2lvbjtcbiAgICAgIG5vUHVyZUNvbW1lbnQgPSBub1B1cmVDb21tZW50ICYmICFoYXNQdXJlQ29tbWVudChpbm5lck5vZGUpO1xuICAgIH1cblxuICAgIGlmICghaW5uZXJOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5vUHVyZUNvbW1lbnQpIHtcbiAgICAgIGlmICh0cy5pc05ld0V4cHJlc3Npb24oaW5uZXJOb2RlKSkge1xuICAgICAgICB0b3BMZXZlbEZ1bmN0aW9ucy5hZGQobm9kZSk7XG4gICAgICB9IGVsc2UgaWYgKHRzLmlzQ2FsbEV4cHJlc3Npb24oaW5uZXJOb2RlKSkge1xuICAgICAgICBsZXQgZXhwcmVzc2lvbjogdHMuRXhwcmVzc2lvbiA9IGlubmVyTm9kZS5leHByZXNzaW9uO1xuICAgICAgICB3aGlsZSAoZXhwcmVzc2lvbiAmJiB0cy5pc1BhcmVudGhlc2l6ZWRFeHByZXNzaW9uKGV4cHJlc3Npb24pKSB7XG4gICAgICAgICAgZXhwcmVzc2lvbiA9IGV4cHJlc3Npb24uZXhwcmVzc2lvbjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXhwcmVzc2lvbikge1xuICAgICAgICAgIGlmICh0cy5pc0Z1bmN0aW9uRXhwcmVzc2lvbihleHByZXNzaW9uKSkge1xuICAgICAgICAgICAgLy8gU2tpcCBJSUZFJ3Mgd2l0aCBhcmd1bWVudHNcbiAgICAgICAgICAgIC8vIFRoaXMgY291bGQgYmUgaW1wcm92ZWQgdG8gY2hlY2sgaWYgdGhlcmUgYXJlIGFueSByZWZlcmVuY2VzIHRvIHZhcmlhYmxlc1xuICAgICAgICAgICAgaWYgKGlubmVyTm9kZS5hcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIHRvcExldmVsRnVuY3Rpb25zLmFkZChub2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9wTGV2ZWxGdW5jdGlvbnMuYWRkKG5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRzLmZvckVhY2hDaGlsZChpbm5lck5vZGUsIGNiKTtcbiAgfVxuXG4gIHRzLmZvckVhY2hDaGlsZChwYXJlbnROb2RlLCBjYik7XG5cbiAgcmV0dXJuIHRvcExldmVsRnVuY3Rpb25zO1xufVxuIl19