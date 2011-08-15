Ext.onReady(function() {
    Ext.define('Teams', {
        extend: 'Ext.data.Model',
        fields: ['name', 'sport']
    });

    var teamStore = new Ext.data.Store({
        model: 'Teams',
        sorters: ['sport','name'],
        groupField: 'sport',
        data: [
            { name: 'Aaron', sport: 'Table Tennis' },
            { name: 'Aaron', sport: 'Football' },
            { name: 'Abe', sport: 'Basketball' },
            { name: 'Tommy', sport: 'Football' },
            { name: 'Tommy', sport: 'Basketball' },
            { name: 'Jamie', sport: 'Table Tennis' },
            { name: 'Brian', sport: 'Basketball' },
            { name: 'Brian', sport: 'Table Tennis' }
        ]
    });

    var grid = new Ext.grid.Panel({
        renderTo: Ext.getBody(),
        store: teamStore,
        width: 400,
        height: 300,
        title: 'Sports Teams',
        features: [{
            ftype: 'grouping'
        }],
        columns: [{
            text: 'Name',
            flex: 1,
            dataIndex: 'name'
        },{
            text: 'Sport',
            dataIndex: 'sport'
        }]
    });
});