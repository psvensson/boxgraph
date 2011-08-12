dojo.provide("boxgraph.routing.manhattan");

dojo.declare("boxgraph.routing.manhattan", null,
{
    getRouting: function(fp, sp)
    {
        var rv = [ {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0} ];  // six points in manhattan
        //var fp = this.firstport;
        //var sp = this.secondport;
        console.log("Manhattan; first and second ports are..");
        console.dir({fp:fp, sp:sp});
        var diffx = sp.x - fp.x;
        var diffy = sp.y - fp.y;
        var hdx = parseInt((diffx + sp.box.model.width)/2, 10);
        var hdy = parseInt((diffy + sp.box.model.height)/2, 10);
        var hs = + parseInt(fp.side/2, 10);
        
        var sphup = sp.box.model.height + sp.position * 5;
        var spwup = sp.box.model.width + sp.position * 5;
        
        console.log("Manhattan: diffx="+diffx+", diffy="+diffy+", hdx="+hdx+". hdy="+hdy+", spwup = "+spwup+", sphup = "+sphup);
        console.log("Manhattan: fp.where = '"+fp.where+"', sp.where = '"+sp.where+"'");
        // -------------------------------- 0
        console.log("point 0");
        rv[0] = {x: fp.x + parseInt(fp.side/2, 10), y: fp.y + parseInt(fp.side/2, 10)};
        // -------------------------------- 1
        console.log("point 1");
        if(fp.where == "top") 
        {            
            rv[1] = this.goUp(rv[0], fp.side);            
        }
        else if(fp.where == "right") 
        {            
            rv[1] = this.goRight(rv[0],fp.side);            
        }
        else if(fp.where == "bottom") 
        {            
            rv[1] = this.goDown(rv[0],fp.side);            
        }
        else if(fp.where == "left") 
        {            
            rv[1] = this.goLeft(rv[0],fp.side);            
        }
        // -------------------------------- 2
        console.log("point 2");
        var d = 0;
        if(fp.where == "top") 
        {                   
            if(sp.where == "top")
            {
                d = Math.abs(sp.x - rv[1].x);
                rv[2] = diffy > 0 ? this.goRight(rv[1], d) : this.goUp(rv[1], -diffy);        
            }
            else if(sp.where == "right" || sp.where == "left")
            {
                d = diffx > 0 ? sp.block.model.x - fp.block.model.x + fp.block.model.width : fp.block.model.x - sp.block.model.x + sp.block.model.width;
                rv[2] = diffx > 0 ? this.goRight(rv[1], d) : this.goLeft(rv[1], d);
            }
            else if(sp.where == "bottom")
            {
                d = diffx > 0 ? hdx : hdx;
                rv[2] = diffx > 0 ? this.goRight(rv[1], d) : this.goLeft(rv[1], -d);
            }
        }
        else if(fp.where == "right") 
        {                          
            if(sp.where == "left")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y - hs) : this.goUp(rv[1], rv[1].y - sp.y -hs);
            }
            else if(sp.where == "bottom")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y + hs) : this.goUp(rv[1], rv[1].y - sp.y + hs);
            }
            else if(sp.where == "top")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y + hs) : this.goUp(rv[1], rv[1].y - sp.y + hs);                
            }
            else if(sp.where == "right")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y + hs) : this.goUp(rv[1], rv[1].y - sp.y + hs);                
            }
        }
        else if(fp.where == "bottom")
        {
            if(sp.where == "top")
            {
                //d = diffx > 0 ? sp.block.model.x - fp.block.model.x + fp.block.model.width : fp.block.model.x - sp.block.model.x + sp.block.model.width;
                //d = diffx > 0 ? hdx : -hdx;
                rv[2] = diffx > 0 ? this.goRight(rv[1], diffx) : this.goLeft(rv[1], -diffx);
            }
            else if(sp.where == "bottom")
            {
                //d = diffx > 0 ? hdx : hdx;
                rv[2] = diffx > 0 ? this.goRight(rv[1], hdx) : this.goLeft(rv[1], -hdx);
            }
        }
        else if(fp.where == "left") 
        {                          
            if(sp.where == "right")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y + hs) : this.goUp(rv[1], rv[1].y - sp.y +hs);
            }
            else if(sp.where == "bottom" || sp.where == "top")
            {
                rv[2] = diffy > 0 ? this.goDown(rv[1], sp.y - rv[1].y + hs) : this.goUp(rv[1], rv[1].y - sp.y + hs);
            }
            else if(sp.where == "left")
            {
                
            }
        }
        // -------------------------------- 3
        console.log("point 3");
        if(fp.where == "top")
        {
            if(sp.where == "top")
            {
                rv[3] = diffx > 0 ? this.goRight(rv[2], sp.x - rv[2].x + hs) : this.goLeft(rv[3], rv[2].x - sp.x + hs);
            }
            else if(sp.where == "right")
            {
                rv[3] = diffx > 0 ? this.goRight(rv[2],spwup * 2) : this.goLeft(rv[2],spwup * 2);
            }
            else if(sp.where == "bottom")
            {
                rv[3] = diffy > 0 ? this.goDown(rv[2], diffy + sp.side) : this.goUp(rv[2], diffy + sp.side);
            }
            else if(sp.where == "left")
            {
                rv[3] = diffx > 0 ? this.goRight(rv[2],spwup * 2) : this.goLeft(rv[2],spwup * 2);
            }
        }
        else if(fp.where == "right" || fp.where == "left")
        {
            if(sp.where == "top")
            {
                rv[3] = this.goRight(rv[2], sp.x - rv[2].x + hs); 
            }
            else if(sp.where == "right")
            {
                rv[3] = diffy > 0 ? this.goDown(rv[2], sp.y - rv[2].y - hs) : this.goUp(rv[2], sp.y + rv[2].y + hs);
            }
            else if(sp.where == "bottom")
            {
                //rv[3] = diffy > 0 ? this.goDown(rv[2], sp.y - rv[2].y - hs) : this.goUp(rv[2], sp.y + rv[2].y + hs);
                rv[3] = diffx > 0 ? this.goRight(rv[2], sp.x - rv[2].x) : this.goLeft(rv[2], rv[2].x - sp.x);
            }
            else if(sp.where == "left")
            {
                //rv[3] = diffy > 0 ? this.goDown(rv[2], sp.y - rv[2].y - hs) : this.goUp(rv[2], sp.y + rv[2].y + hs);
                rv[3] = diffx > 0 ? this.goRight(rv[2], sp.x - rv[2].x) : this.goLeft(rv[2], rv[2].x - sp.x);
            }
        }
        else if(fp.where == "bottom")
        {
            if(sp.where == "top")
            {
                rv[3] = diffy > 0 ? this.goDown(rv[2], sp.y - rv[2].y + parseInt(fp.side/2, 10)) : this.goUp(rv[2], rv[2].y - sp.y - parseInt(fp.side/2, 10));
            }
            else if(sp.where == "bottom")
            {
                rv[3] = diffy > 0 ? this.goDown(rv[2], sp.y - rv[2].y + parseInt(fp.side/2, 10)) : this.goUp(rv[2], rv[2].y - sp.y - parseInt(fp.side/2, 10));
            }
        }
        
        /*
        if(fp.where == "top")
        {
            rv[0].x = fp.x;
            rv[0].y = fp.y - fp.side;   
        }
        if(fp.where == "right")
        {
            rv[0].x = fp.x + fp.side;
            rv[0].y = fp.y;   
        }
        if(fp.where == "bottom")
        {
            rv[0].x = fp.x;
            rv[0].y = fp.y + fp.side;   
        }
        if(fp.where == "left")
        {
            rv[0].x = fp.x - fp.side;
            rv[0].y = fp.y;   
        }
        // -------------------------------- 1
        if(fp.where == "left" && sp.where == "right")
        {            
            rv[1].x = fp.x - hdx;
            rv[1].y = fp.y;
        }
        else if(fp.where == "right" && sp.where == "left")
        {            
            rv[1].x = fp.x + hdx;
            rv[1].y = fp.y;
        }
        else if((fp.where == sp.where && sp.where == "left") || (fp.where == sp.where && sp.where == "right"))
        {
            rv[1].x = rv[0].x;
            if(diffy > 0)
            {
                rv[1].y = rv[0].y + sphup;                
            }
            else
            {
                rv[1].y = rv[0].y - sphup;              
            }
        }
        else if((fp.where == sp.where && sp.where == "top") || (fp.where == sp.where && sp.where == "bottom"))
        {
            rv[1].y = rv[0].y;
            if(diffx > 0)
            {
                rv[1].x = rv[0].x + spwup;                
            }
            else
            {
                rv[1].x = rv[0].x - spwup;              
            }
        }
        else if(fp.where == "bottom" || fp.where == "top")
        {
            rv[1].y = fp.y;
            if(diffx > 0)
            {
                rv[1].x = rv[0].x - spwup;   
            }
            else
            {            
                rv[1].x = rv[0].x + spwup;
            }
        }
        
        // -------------------------------- 2
        if(diffx > 0)
        {
               
        }
        
        // -------------------------------- 3
        */
        rv[4] = {x: sp.x + hs, y: sp.y + hs};
        rv[5] = {x: sp.x + hs, y: sp.y + hs};
        return rv;
    },
    
    getCurvedRouting: function()
    {
        var j = parseInt(this.firstport.side/2, 10);
        return {x1: this.firstport.x+j, y1: this.firstport.y+j, x2: this.secondport.x+j, y2: this.secondport.y+j}   ;
    },
    
    goUp: function(oldpoint, a)
    {
        console.log("goUp "+a);
        return {x: oldpoint.x, y: oldpoint.y - a};
    },
    
    goDown: function(oldpoint, a)
    {
        console.log("goDown "+a);
        return {x: oldpoint.x, y: oldpoint.y + a};
    },
    
    goRight: function(oldpoint, a)
    {
        console.log("goRight "+a);
        return {x: oldpoint.x + a, y: oldpoint.y};
    },
    
    goLeft: function(oldpoint, a)
    {
        console.log("goLeft "+a);
        return {x: oldpoint.x - a, y: oldpoint.y};
    }

});
