# Scrollbars 2
**important**

Some other text here

some    | info       | here
--------|------------|--------
or here | maybe here | or here


```js
const myVar="this is my var";
```
# InfiniteList
This component creates a scrollable list of elements 

```js

    import React from 'react';
    import { List } from 'immutable';

    const MyComponent = ( props ) => {

        const items = List([ a,b,c ]);
        const scrollbar = { autoHide:true };

        return(
            <InfiniteList 
                    items={items}
                    visibles={10}
                    defaultRowHeight={100}
                    totalItems={items.size}
                    scrollbarProps={scrollbar}
                    />
        );

    }
```

Prop | Values | Details
-----|--------|--------|
items | Immutable.[ Map, List, Iterables... ], Array[]|The elements to be rendered
visibles|number|Quantity of elements to be displayed 
renderFunc|function(item, pageIndex, globalIndex)|Function to render items
defaultRowHeight|number|Allows to make the first list calculation
totalItems|number|Allows to know if all items are being diplayed
scrollbarProps|object( {...} )|The customization of scrollbars

**notes**: