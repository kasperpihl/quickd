Ext.define('QuickD.view.BetaScreen', {
    extend: 'Ext.form.Panel',
    requires:[
        'Ext.form.Panel'
    ],
    xtype: 'betascreen',
    config: {
        layout:'vbox',
        // We give it a left and top property to make it floating by default    
        centered:true,
        width: 300,
        height:300,
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
        styleHtmlContent: true,
        scrollable: true,
        id:'quickd-beta-screen',
        items: [{
            xtype:'panel',
            html:'Dette er en lukket beta i Aarhus, indtast den betakode du har modtaget'
        },{
            xtype:'textfield',
            placeHolder:'Betanøgle',
            id:'betakeyField',
            width:'260px'
        },{
            xtype:'button',
            width:100,
            ui:'confirm',
            id:'useBetaKey',
            text:'Brug nøgle'
        },{
            xtype:'panel',
            html: 'Eller anmod om en betanøgle',
            cls: 'requestNewPassText'
        },{
            xtype:'button',
            ui: 'rounded',
            text: 'Registrer med facebook',
            cls:'useFacebook',
            id:'loginWithFacebook',
            width:260
        },{
            xtype:'button',
            ui: 'rounded',
            cls:'useEmail',
            text: 'Brug email',
            width:100,
            hidden:true
        },{
            xtype:'textfield',
            label:'Email',
            placeHolder:'eks. navn@quickd.com',
            id:'emailField',
            hidden:true
        }]
    }
}); 