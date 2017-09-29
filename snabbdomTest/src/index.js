var snabbdom = require('snabbdom');
var patch = snabbdom.init([ // Init patch function with chosen modules
    require('snabbdom/modules/class').default, // makes it easy to toggle classes
    require('snabbdom/modules/props').default, // for setting properties on DOM elements
    require('snabbdom/modules/style').default, // handles styling on elements with support for animations
    require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
var h = require('snabbdom/h').default; // helper function for creating vnodes

var container = document.getElementById('container');

var vnode = h('div#container.two.classes', {
    on: {
        click: someFn
    }
}, [
    h('span', {
        style: {
            fontWeight: 'bold'
        }
    }, 'This is bold'),
    ' and this is just normal text',
    h('a', {
        props: {
            href: '/foo'
        }
    }, 'I\'ll take you places!')
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

var newVnode = h('div#container.two.classes', {
    on: {
        click: someFn
    },
    hook: {
        update: (oldNode, newNode) => {
            return oldNode = newNode;
        }
    }
}, [
    h('span', {
        style: {
            fontWeight: 'normal',
            fontStyle: 'italic'
        }
    }, 'This is now italic type'),
    ' and this is still just normal text',
    h('a', {
        class: {
            active: true, selected: false
        }
    }, 'Toggle'),
    h('a', {
        props: {
            href: 'http://baidu.com',
            target: '_blanck'
        }
    }, 'baidu'),
    h('button', {
        dataset: {
            action: 'resets'
        }
    }, 'Reset'),
    h('span', {
        style: {
            opacity: '1',
            transition: 'opacity 1s',
            destroy: {
                opacity: '0'
            }
        }
    }, 'It\'s better to fade out than to burn away'),
    h('a', {
        props: {
            href: '/bar'
        }
    }, 'I\'ll take you places!')
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state


function someFn(e) {
    console.log('e', e);
}
