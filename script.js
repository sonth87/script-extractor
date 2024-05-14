import Script from "next/script"; // replace with another choice

/** 
*  Entry point
*  [list of script string]
*  Eg: [
*         "<script async src='https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X' />",
*         "<script>console.log('this is script')</script>",
*         "alert('alert script')"
*      ]
*/
export const scriptGenerator = (scriptsTxt) => {
  const list = scriptsTxt?.map((script, idx) => scriptExtractor(script, idx));

  return list;
};

/**
*  Executing extract
*  Transform:
*  "<script async src='https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X' />"  -->  <script async src='https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X' />
*  "<script>console.log('this is script')</script>"  -->  <script>console.log('this is script')</script>
*  "alert('alert script')"  -->  <script>alert('alert script')</script>
*/
export const scriptExtractor = (script, idx) => {
  if (!script) return;

  try {
    const _script = script.trim();
    const scriptTestReg = new RegExp(
      /(<script([a-z0-9\\\/\"\?\-\=\:\s\.]*)>)(.*)(<\/script>)/gims
    );

    // case: <script>....</script>
    if (/^(<script>).*/.test(_script)) {
      return (
        <Script
          key={"script-" + idx}
          id={"script-" + idx}
          dangerouslySetInnerHTML={{
            __html: script.replace("<script>", "").replace("</script>", ""),
          }}
        />
      );
    } else if (/^(<script\s).*/.test(_script)) {
      if (/(<script([a-z0-9\\\/\"\?\-\=\:\s\.]*)\/>)/gim.test(_script)) {
        // case: <script async defer src="..." />
        
        const scriptProps = script
          .replace("<script", "")
          .replace("/>", "")
          .trim();
        const props = scriptProps.split(/\s+/);
        const transfer = {};

        props?.map((sc) => {
          const p = splitOnce(sc, "=");
          if (p.length === 1) transfer[p[0]] = true;
          else if (p.length === 2) transfer[p[0]] = p[1].replace(/"|'/g, "");
        });

        return (
          <Script key={"script-" + idx} id={"script-" + idx} {...transfer} />
        );
      } else if (scriptTestReg.test(_script)) {
        // case: <script async defer src="..."> ... </script>
        
        scriptTestReg.lastIndex = 0;
        const scriptExc = scriptTestReg.exec(_script);

        const props = scriptExc?.[2]
          ? scriptExc?.[2]?.split(/\s+/)?.filter((sc) => sc?.length)
          : [];
        const content = scriptExc?.[3] || "";
        const transfer = {};

        props?.map((sc) => {
          const p = splitOnce(sc, "=");
          if (p.length === 1) transfer[p[0]] = true;
          else if (p.length === 2) transfer[p[0]] = p[1].replace(/"|'/g, "");
        });

        return (
          <Script
            key={"script-" + idx}
            id={"script-" + idx}
            {...transfer}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
    } else {
      // case:  script content without script tags

      return (
        <Script
          key={"script-" + idx}
          id={"script-" + idx}
          dangerouslySetInnerHTML={{ __html: script }}
        />
      );
    }
  } catch (e) {
    return null;
  }
};

/**
*  Split once
*  Eg: 'src="https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X"'
*  We want to split at the first equal character (=). Expectation: ["src", "https://www.googletagmanager.com/gtag/js?id=G-SKYJESDIW1X"]
*/
var splitOnce = function (str, delim) {
  var components = str.split(delim);
  var result = [components.shift()];
  if (components.length) {
    result.push(components.join(delim));
  }
  return result;
};
