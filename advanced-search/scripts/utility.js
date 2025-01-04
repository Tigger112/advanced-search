const hex2rgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // return r,g,b
  return r + "," + g + "," + b;
};


function onPageUpdate(run, arg) {
  // calls 
  run(arg);
  const reRun = new MutationObserver(() => {
    run(arg);
  });
  const config = { attributes: true, childList: true, subtree: true };
  // rcnt is the main content of a google page if it not there just default to the body
  const main = document.getElementById("rcnt") || document.body
  reRun.observe(main, config);
};