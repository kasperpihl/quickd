Ext.define('QuickD.view.BetaScreen', {
    extend: 'Ext.form.Panel',
    requires:[
        'Ext.form.Panel',
        'Ext.Label',
        'Ext.form.FieldSet'
    ],
    xtype: 'betascreen',
    config: {
        layout:'vbox',
        // We give it a left and top property to make it floating by default    
        centered:true,
        width: 300,
        height:300,
        scrollable:false,
        showAnimation: {
            type: 'fadeIn',
            duration: 500
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 500
        },
        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: false,
        hidden: true,
        styleHtmlContent: false,
        id:'quickd-beta-screen',
        items: [
        {
            xtype:'fieldset',
            title:'Dette er en lukket beta i Aarhus',
            instructions:'Indtast den betakode du har modtaget',
            items:[{
                xtype:'textfield',
                placeHolder:'Betanøgle',
                id:'betakeyField',
                width:'265px',
                listeners:{
                    focus:function(){ this.getParent().getParent().gotFocus(); }
                }
            },{
                xtype: 'label',
                html: 'Den indtastede betakode er forkert',
                id: 'betaErrorText',
                hidden:true,
                cls: 'errorField'
            }]
        },{
            xtype:'button',
            width:100,
            ui:'confirm',
            id:'useBetaKey',
            text:'Brug nøgle'
        },{
            xtype:'label',
            html: 'Anmod om betanøgle',
            cls: 'requestNewPassText',
            listeners:{
                tap:function(){
                    alert('YEAH');
                }
            }
        },{
            xtype:'button',
            id: 'requestKeyButton',
            text: 'Anmod om betanøgle'
        }]
    },
    gotFocus:function(){
        if(this.errorShown) this.removeError();
        return;
    },
    removeError:function(){
        if(!this.errorShown) return false;
        this.errorShown = false;
        this.down('fieldset').setInstructions('Indtast den betakode du har modtaget');
        var comp = this.down('#betaErrorText');
        comp.hide();
    },
    showError:function(text){
        if(this.errorShown) return false;
        this.errorShown = true;
        this.down('fieldset').setInstructions('');
        var comp = this.down('#betaErrorText');
        comp.show();
    }
}); 