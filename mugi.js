
//
// Thanks to tsoding. 
//
function tag(name, ...children) 
{

  const result = document.createElement(name);

  result.push = function(...children) {
    for (const child of children) {
      if (typeof(child) === 'string') {
        this.appendChild(document.createTextNode(child));
      }
      else {
        this.appendChild(child);
      }
    }

    return this;
  }


  result.attr = function(n, v) {
    if (typeof(v) === "undefined") {
      this.removeAttribute(n); 
    }
    else {
      this.setAttribute(n,v);
    }
    return this;
  }

  result.on_click = function(callback) {
    this.onclick = callback;
    return this;
  }

  result.on_event = function(n, callback) {
    //TODO: removeEventListener. We have to store the callback somehow
    this.addEventListener(n, callback);
    return this;
  }

  result.push(...children);
  return result;
}

function router(routes) {
  let result = div();
  
  // This is quite clever. We use a '#' to indicate where we are in a way.
  function sync_hash() {
    let hash_location = document.location.hash.split('#')[1];
    // If there is no hash, we are at root
    
    if (!hash_location) {
      hash_location = '/'

    }
  
    if (!(hash_location in routes)) {
      // TODO: do something when we can't find the hash.
      const route_404 = '/404';
      console.assert(route_404 in routes);
      hash_location = route_404;
    }

    // Remove everything
    while(result.firstChild) {
      result.removeChild(result.lastChild);
    }

    // Then add the appropriate page
    result.appendChild(routes[hash_location]());
    return result;
  }
  sync_hash();

  // Apparently browsers have an event to detect change in '#' location in URLs???
  window.addEventListener("hashchange", sync_hash);
  result.refresh = sync_hash;
  return result;
}

const tag_types = ["div", "img", "h1", "h2", "h3", "span", "p", "button", "hr", "span"]
for (const type of tag_types) {
  window[type] = (...children) => tag(type, ...children)
}

