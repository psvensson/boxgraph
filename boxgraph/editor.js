dojo.provide("boxgraph.editor");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dojox.gfx");
dojo.require("boxgraph.box");
dojo.require("boxgraph.portmanager");

dojo.declare("boxgraph.editor", [ dijit._Widget, dijit._Templated ],
{
	templatePath			: dojo.moduleUrl("boxgraph", "editor.html"),
    surface                 : "", // Can be provided, otherwise we create a new surface
    entities                : [],
    
    //06799F    216278	024E68	3AAACF	62B4CF
    
    postCreate: function()
    {
        this.inherited(arguments);
        console.log("postCreate in boxgraph.editor called");
        if(!this.surface)
        {
		    this.surface = dojox.gfx.createSurface(this.editordiv, 500, 500);
        }
        //----
        this.portmanager = new boxgraph.portmanager({surface : this.surface});
        this.test();
    },
    
    test: function()
    {
        var block1 = new boxgraph.box({surface: this.surface, model: {name:"foo", x:100, y: 150, height:100, width: 100} });
        block1.addPort({ where: "right", position: 1});
        block1.addPort({ where: "right", position: 2});
        block1.addPort({ where: "left", position: 1});
        block1.addPort({ where: "top", position: 1});
        block1.addPort({ where: "bottom", position: 1});
        var block2 = new boxgraph.box({surface: this.surface, model: {name: "bar", x:260, y: 90, height:100, width: 100} });
        block2.addPort({ where: "left", position: 1});
        block2.addPort({ where: "right", position: 1});
        block2.addPort({ where: "top", position: 1});
        block2.addPort({ where: "bottom", position: 1});
        block2.addPort({ where: "bottom", position: 2});
        
        
        this.addEntity(block1);  
        this.addEntity(block2);
        block1.render();
        block2.render();
    },
    
    addEntity: function(e)
    {
        this.entities.push(e);
    }
});