export function isServer () { return typeof window === 'undefined'; }

export function isClient () { return typeof window !== 'undefined'; }

export function isUndefined ( elem: any ) { return elem === undefined; }

export function isDefined ( elem: any ) { return elem !== undefined; }

export function isEmptyArray ( array: any[] ) { return array.length === 0; }

export function isNotEmptyArray ( array: any[] ) { return array.length > 0; }

export function checkExistVariable ( variable: any, name: string ) { if ( isUndefined( variable ) ) { throw new Error( `${ name } variable is undefined!` ); } }