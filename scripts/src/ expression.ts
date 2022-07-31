function Expression(expr:string,start:number,end:number,step:number,k:number=1):Array<Array<number>>{
    if(start>end){
        let temp=start;
        start=end;
        end=temp;
    }
    let result:Array<Array<number>>=[];
    function abs(c){return Math.abs(c);}
    function sqrt(c){return Math.sqrt(c);}
    function cbrt(c){return Math.cbrt(c);}
    function ceil(c){return Math.ceil(c);}
    function floor(c){return Math.floor(c);}
    function round(c){return Math.round(c);}
    function sin(c){return Math.sin(c);}
    function cos(c){return Math.cos(c);}
    function tan(c){return Math.tan(c);}
    function asin(c){return Math.asin(c);}
    function acos(c){return Math.acos(c);}
    function atan(c){return Math.atan(c);}
    function atan2(c,d){return Math.atan2(c,d);}
    function sinh(c){return Math.sinh(c);}
    function cosh(c){return Math.cosh(c);}
    function tanh(c){return Math.tanh(c);}
    function asinh(c){return Math.asinh(c);}
    function acosh(c){return Math.acosh(c);}
    function atanh(c){return Math.atanh(c);}
    function ln(c){return Math.log(c);}
    function log(c){return Math.log(c);}
    function log10(c){return Math.log10(c);}
    function exp(c){return Math.exp(c);}
    function expm1(c){return Math.expm1(c);}
    function rint(c){return round(sqrt(c*c))*c/sqrt(c*c)}
    function random(){return Math.random();}
    function randint(c){return Math.trunc(random()*c);}
    function pow(c,d){return Math.pow(c,d);}
    for(let x=start;x<=end;x+=step)
        for(let y=start;y<=end;y+=step)
            for(let z=start;z<=end;z+=step)
                if(eval(`(${expr})`))
                    result.push([Math.trunc(k*x),Math.trunc(k*y),Math.trunc(k*z)]); 
    return result;
}
export {Expression};