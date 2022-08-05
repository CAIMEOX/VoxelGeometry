function Expression(expr:string,start:number,end:number,step:number,k:number=1):Array<Array<number>>{
    if(start>end){
        let temp=start;
        start=end;
        end=temp;
    }
    let result:Array<Array<number>>=[];
    function abs(c:number){return Math.abs(c);}
    function sqrt(c:number){return Math.sqrt(c);}
    function cbrt(c:number){return Math.cbrt(c);}
    function ceil(c:number){return Math.ceil(c);}
    function floor(c:number){return Math.floor(c);}
    function round(c:number){return Math.round(c);}
    function sin(c:number){return Math.sin(c);}
    function cos(c:number){return Math.cos(c);}
    function tan(c:number){return Math.tan(c);}
    function asin(c:number){return Math.asin(c);}
    function acos(c:number){return Math.acos(c);}
    function atan(c:number){return Math.atan(c);}
    function atan2(c:number,d:number){return Math.atan2(c,d);}
    function sinh(c:number){return Math.sinh(c);}
    function cosh(c:number){return Math.cosh(c);}
    function tanh(c:number){return Math.tanh(c);}
    function asinh(c:number){return Math.asinh(c);}
    function acosh(c:number){return Math.acosh(c);}
    function atanh(c:number){return Math.atanh(c);}
    function ln(c:number){return Math.log(c);}
    function log(c:number){return Math.log(c);}
    function log10(c:number){return Math.log10(c);}
    function exp(c:number){return Math.exp(c);}
    function expm1(c:number){return Math.expm1(c);}
    function rint(c:number){return round(sqrt(c*c))*c/sqrt(c*c)}
    function random(){return Math.random();}
    function randint(c:number){return Math.trunc(random()*c);}
    function pow(c:number,d:number){return Math.pow(c,d);}
    for(let x=start;x<=end;x+=step)
        for(let y=start;y<=end;y+=step)
            for(let z=start;z<=end;z+=step)
                if(eval(`(${expr})`))
                    result.push([Math.trunc(k*x),Math.trunc(k*y),Math.trunc(k*z)]); 
    return result;
}
export {Expression};