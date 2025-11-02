export const normalizePathname = (path?: string, lowerCase: boolean = true) => {
    if (!path || path === '/') {
        return '/'
    }
    if (!path.startsWith('/')) {
        path = '/' + path
    }
    path = removeTrailingSlash(path)

    if(lowerCase) {
      path = path.toLowerCase()
    }

    return path;
}


const removeTrailingSlash = (path: string) => {
    if (hasTrailingSlash(path)) {
        path = path.substring(0, path.length-1);
    }
    return path;
}

const hasTrailingSlash = (path: string) => {
    if (path.substring(path.length-1) == "/") {
        return true
    }
    return false
}

/**
  * @description
  * Will match a url declaration with an incoming pathname
  *   /users/:id/edit
  *   /users/5345/edit
*/
export const matchPath = (
    pattern: string,
    pathname: string
): Record<string, string> | undefined => {
    pattern = normalizePathname(pattern)
    const params: Record<string, string> = {}
    const source = pattern.split('/')
    const test = pathname.split('/')
    if (source.length !== test.length && !pattern.includes('**')) {
        return
    }
    for (const i in source) {
        if (source[i].startsWith(':') && pathname !== '/') {
            const paramName = source[i].slice(1)
            params[paramName] = test[i].toString()
            continue
        }
        if (source[i].startsWith('**')) {
          return params
        }
        if (source[i] !== test[i].toLowerCase()) {
            return
        }
    }
    return params
}
