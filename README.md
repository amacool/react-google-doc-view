# How to use this component
```
...
import ReactGoogleDocView, { getSectionBlocks } from './react-google-doc-view';
import { dummyData } from './react-google-doc-view/dummyData';
...

...
  render() {
    return (
      ...
      <ReactGoogleDocView
        docContent={getSectionBlocks(dummyData)}
      />
      ...
    )
  }
```
