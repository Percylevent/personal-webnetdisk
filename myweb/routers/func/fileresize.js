function fileresize(size){
          var num = 1024.00; //byte
          if (size < num)
                  return size + "B";
          if (size < Math.pow(num, 2))
                  return (size / num).toFixed(2) + "KB"; //kb
          if (size < Math.pow(num, 3))
                  return (size / Math.pow(num, 2)).toFixed(2) + "MB"; //M
          if (size < Math.pow(num, 4))
                  return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
          return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}

function sortBy(attr,rev){
    if( rev==undefined ){ rev=1 }else{ (rev)?1:-1; }
    return function (a,b){
        a=a[attr];
        b=b[attr];
        if(a<b){ return rev*-1}
        if(a>b){ return rev* 1 }
        return 0;
    }
}

module.exports ={fileresize,sortBy  }

