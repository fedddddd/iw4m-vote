let plugin = {
    author: 'fed',
    version: 1.0,
    name: 'Vote Kick Plugin',
    manager: null,
    logger: null,
    server: null,
    immunityLevel: 2, // Level at which a player cannot be kicked (ex. 2: Trusted, 3: Moderator...)
    modLevel: 3, // Level at which a player can moderate the votekick  
    voteCooldown: 120, // If a vote fails, the player who started it won't be able to call another vote for the specified time (default 120s)
    currentvote: {
        type: null,
        data: {},
        votes: [],
        start: null
    },
    voteCooldowns: [],
    nextMap: null,
    currentEffects: [],
    configuration: {
        effects: {
            rgb: {
                type: 'rgb',
                effectStart: 'seta sv_rgb 1',
                end: {
                    value: 'OFF',
                    command: 'seta sv_rgb 0'
                }
            },
            gravity: {
                type: 'gravity',
                effectStart: 'g_gravity %value%',
                end: {
                    value: '800',
                    command: 'g_gravity 800'
                }
            },
            jetpack: {
                type: 'jetpack',
                effectStart: 'seta gg_jetpack 1',
                end: {
                    value: 'OFF',
                    command: 'seta gg_jetpack 0'
                }
            },
            explosives: {
                type: 'explosives',
                effectStart: 'seta sv_explosives 1',
                end: {
                    value: 'OFF',
                    command: 'seta sv_explosives 0'
                }
            },
            jumpHeight: {
                type: 'jumpHeight',
                effectStart: 'jump_height %value%',
                end: {
                    value: '39',
                    command: 'jump_height 39'
                }
            }
        },
        commands: {
            kick: {
                command: 'votekick',
                description: 'Vote to kick a player, Usage: $votekick <player>',
                type: 'kick',
                alias: 'vk',
                enabled: true,
                level: 0
            },
            votemap: {
                command: 'votemap',
                description: 'Vote to change map, Usage: $vm <mapname>',
                type: 'votemap',
                alias: 'vm',
                enabled: true,
                level: 0
            },
            nextmap: {
                command: 'nextmap',
                description: 'Vote next map, Usage: $nextmap <mapname>',
                type: 'nextmap',
                alias: 'nm',
                enabled: false,
                level: 0
            },
            yes: {
                command: 'yes',
                description: 'Add your vote to the current vote, Usage: $yes',
                type: 'yes',
                alias: 'y',
                enabled: true,
                level: 0
            },
            skip :{
                command: 'skip',
                description: 'Vote to skip the current map, Usage: $skip',
                type: 'skip',
                alias: 's',
                enabled: true,
                level: 0
            },
            maps: {
                command: 'maps',
                description: 'Shows map list, Usage: $maps',
                type: 'maps',
                alias: 'm',
                enabled: true,
                level: 0
            },
            help: {
                command: 'help',
                description: 'Do $help <command> for command usage',
                type: 'help',
                alias: null,
                enabled: true,
                level: 0
            },
            stop: {
                command: 'stop',
                description: 'Stops current vote, Usage: $stop',
                type: 'stop',
                alias: 'cancel',
                enabled: true,
                level: 3
            },
            rgb: {
                command: 'rgb',
                description: 'Vote to start ^1R^2G^5B^7, Usage: $rgb',
                type: 'rgb',
                alias: null,
                enabled: true,
                level: 0
            },
            gravity: {
                command: 'gravity',
                description: 'Vote set ^5gravity^7 to specified value, Usage: $gravity <value>',
                type: 'gravity',
                alias: null,
                enabled: true,
                level: 0
            },
            explosives: {
                command: 'explosives',
                description: 'Vote to enable ^1explosives only^7, Usage $explosives',
                type: 'explosives',
                alias: null,
                enabled: true,
                level: 0
            },
            jetpack: {
                command: 'jetpack',
                description: 'Vote to enable ^1jetpacks^7, Usage: $jetpack',
                type: 'jetpack',
                alias: null,
                enabled: true,
                level: 0
            },
            jumpHeight: {
                command: 'jumpHeight',
                description: 'Vote to set ^5jump height^7 to specified value, Usage $jumpheight <value>',
                type: 'jumpHeight',
                alias: 'jh',
                enabled: true,
                level: 0
            }
        },
        vote: {
            cooldown: 120, // Vote cooldown if a player's vote fails
            duration: 60, // Duration of a vote
            minimumPlayers: 3 // Minimum players for a votekick
        },
        maps: { // Map configuration
            '-1': {},
            '0': {},
            '1': {},
            '2': {},
            '3': {
                exclusions: [ // Exclude these map from votemap command
                    {
                        "Name": "mp_boardwalk",
                        "Alias": "Boardwalk"
                    },
                    {
                        "Name": "mp_burn_ss",
                        "Alias": "U-turn"
                    },
                    {
                        "Name": "mp_cement",
                        "Alias": "Foundation"
                    },
                    {
                        "Name": "mp_crosswalk_ss",
                        "Alias": "Intersection"
                    },
                    {
                        "Name": "mp_hillside_ss",
                        "Alias": "Getaway"
                    },
                    {
                        "Name": "mp_italy",
                        "Alias": "Piazza"
                    },
                    {
                        "Name": "mp_meteora",
                        "Alias": "Sanctuary"
                    },
                    {
                        "Name": "mp_moab",
                        "Alias": "Gulch"
                    },
                    {
                        "Name": "mp_morningwood",
                        "Alias": "Black Box"
                    },
                    {
                        "Name": "mp_nola",
                        "Alias": "Parish"
                    },
                    {
                        "Name": "mp_overwatch",
                        "Alias": "Overwatch"
                    },
                    {
                        "Name": "mp_park",
                        "Alias": "Liberation"
                    },
                    {
                        "Name": "mp_qadeem",
                        "Alias": "Oasis"
                    },
                    {
                        "Name": "mp_restrepo_ss",
                        "Alias": "Lookout"
                    },
                    {
                        "Name": "mp_roughneck",
                        "Alias": "Off Shore"
                    },
                    {
                        "Name": "mp_shipbreaker",
                        "Alias": "Decommission"
                    },
                    {
                        "Name": "mp_six_ss",
                        "Alias": "Vortex"
                    }
                ],
                extra: [ // Add these maps to the votemap command
                    {
                        Name: 'mp_rust',
                        Alias: 'Rust'
                    },
                    {
                        Name: 'mp_test',
                        Alias: 'Testmap'
                    }
                ]
            },
            '4': {},
            '5': {},
            '6': {},
            '7': {}

        }
    },
    localization: {
        'kick': {
            description: 'kick ^5%name%^7',
            message: 'You have been votekicked'
        },
        'votemap': {
            description: '^5change the map^7 to ^5%name%^7',
            message: 'Attemping to change map to ^5%name%^7 in [^53^7] seconds'
        },
        'skip': {
            description: 'skip the ^5current map^7',
            message: 'Map rotating in [^53^7] seconds'
        },
        'nextmap': {
            description: 'set the next map to ^5%name%^7',
            message: 'Next map will be [^5%name%^7]'
        },
        'rgb': {
            description: 'turn ^1R^2G^5B^7 on',
            message: '^1R^2G^5B^7 [^5%value%^7]'
        },
        'gravity': {
            description: 'set ^5gravity^7 to [^5%name%^7]',
            message: '^5gravity^7 set to [^5%value%^7]'
        },
        'explosives': {
            description: 'set game to ^1explosives only^7',
            message: '^1explosives only^7 [^5%value%^7]'
        },
        'jetpack': {
            description: 'enable ^2jetpacks^7',
            message: '^2jetpacks^7 [^5%value%^7]'
        },
        'jumpHeight': {
            description: 'set ^5jump_height^7 to [^5%name%^7]',
            message: '^5jump_height^7 set to [^5%value%^7]'
        }
    },
    getPlayers: function() {
        var count = 0;
        var players = this.server.Clients.toArray()
        for (var i = 0; i < players.length; i++) {
            if (players[i] != null) {
                count++;
            }
        }
        return count;
    },
    Log: function(data) {
        this.logger.WriteInfo(data)
    },
    resetVote: function() {
        this.currentvote = {
            type: null,
            data: {},
            votes: [],
            start: null
        };
    },
    addVote: function(from, server, param = null) {
        if (this.checkCooldown(from) < this.configuration.vote.cooldown && this.checkCooldown(from) > 0 && param != null) {
            from.tell(`Your previous vote failed, please wait another ^5${Math.ceil(this.configuration.vote.cooldown - this.checkCooldown(from))}^7 seconds before starting another`);
            return;
        }
        this.currentvote.type == null ? this.currentvote = {
            type: param.type,
            data: {
                target: param.target,
                from: from
            },
            votes: [{
                from: from
            }],
            start: new Date()} : this.currentvote.votes.push({ from: from });
        server.Broadcast(`^5${from.Name}^7 is voting to ${this.localization[this.currentvote.type].description.replace('%name%', this.currentvote.data.target.Name)}, type ^3$yes^7 to vote too ( ${this.currentvote.votes.length} / ${this.getMinimumVotes()} )`)
        System.Threading.Thread.Sleep(100);
        if (this.currentvote.votes.length >= this.getMinimumVotes()) {
            switch (this.currentvote.type) {
                case this.configuration.commands.kick.type:
                    this.currentvote.data.target.Kick(this.localization['kick'].message, _IW4MAdminClient)
                    break;
                case this.configuration.commands.votemap.type:
                    server.Broadcast(this.localization['votemap'].message.replace('%name%', this.currentvote.data.target.Name))
                    System.Threading.Thread.Sleep(3000);
                    server.LoadMap(this.currentvote.data.target.Namemp);
                    break;
                case this.configuration.commands.skip.type:
                    server.Broadcast(this.localization['skip'].message)
                    System.Threading.Thread.Sleep(3000);
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, "map_rotate");
                    break;
                case this.configuration.commands.nextmap.type:
                    server.Broadcast(this.localization['nextmap'].message.replace('%name%', this.currentvote.data.target.Name))
                    this.nextMap = this.currentvote.data.target.Namemp;
                    break;
                case this.configuration.commands.rgb.type:
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, "seta sv_rgb 1");
                    server.Broadcast(this.localization['rgb'].message.replace('%value%', 'ON'))
                    this.currentEffects.push({type: this.configuration.effects.rgb.type, start: new Date()})
                    /*
                        This command sets sv_rgb to 1 then you must have a server side script to do the rgb effect, for example in gsc using setSunLight(r, g, b)
                    */
                    break;
                case this.configuration.commands.jetpack.type:
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, "seta gg_jetpack 1");
                    server.Broadcast(this.localization['jetpack'].message.replace('%value%', 'ON'))
                    this.currentEffects.push({type: this.configuration.effects.jetpack.type, start: new Date()})
                    break;
                case this.configuration.commands.explosives.type:
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, "seta sv_explosives 1");
                    server.Broadcast(this.localization['explosives'].message.replace('%value%', 'ON'))
                    this.currentEffects.push({type: this.configuration.effects.explosives.type, start: new Date()})
                    break;
                case this.configuration.commands.gravity.type:
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, `g_gravity ${this.currentvote.data.target.Name}`);
                    server.Broadcast(this.localization['gravity'].message.replace('%value%', this.currentvote.data.target.Name))
                    this.currentEffects.push({type: this.configuration.effects.gravity.type, start: new Date()})
                    break;
                case this.configuration.commands.jumpHeight.type:
                    server.RconParser.ExecuteCommandAsync(server.RemoteConnection, `jump_height ${this.currentvote.data.target.Name}`);
                    server.Broadcast(this.localization['jumpHeight'].message.replace('%value%', this.currentvote.data.target.Name))
                    this.currentEffects.push({type: this.configuration.effects.jumpHeight.type, start: new Date()})
                    break;
            }
            this.resetVote();
        }
    },
    checkCooldown: function(player) {
        for (var i = 0; i < this.voteCooldowns.length; i++) {
            if (this.voteCooldowns[i].player.Name == player.Name) {
                return (new Date() - this.voteCooldowns[i].start) / 1000;
            }
        }
        return -1;
    },
    getMap: function(name, server) {
        var Maps = [];
        for (var i = 0; i < server.Maps.toArray().length; i++) {
            Maps.push(server.Maps.toArray()[i]);
        }
        if (this.configuration.maps[server.GameName.toString()].extra) {
            for (var i = 0; i < this.configuration.maps[server.GameName.toString()].extra.length; i++) {
                Maps.push(this.configuration.maps[server.GameName.toString()].extra[i]);
            }
        }
        if (this.configuration.maps[server.GameName.toString()].exclusions) {
            for (var i = 0; i < this.configuration.maps[server.GameName.toString()].exclusions.length; i++) {
                for (var o = 0; o < Maps.length; o++) {
                    if (Maps[o].Name.toLocaleLowerCase() == this.configuration.maps[server.GameName.toString()].exclusions[i].Name.toLocaleLowerCase() || Maps[o].Alias.toLocaleLowerCase() == this.configuration.maps[server.GameName.toString()].exclusions[i].Alias.toLocaleLowerCase()) {
                        Maps.splice(o, 1);
                    }
                }
            }
        }

        for (var i = 0; i < Maps.length; i++) {
            if (Maps[i].Name.toLocaleLowerCase() == name.toLocaleLowerCase() || Maps[i].Alias.toLocaleLowerCase() == name.toLocaleLowerCase()) {
                return {
                    Name: Maps[i].Alias,
                    Namemp: Maps[i].Name
                }
            }
        }
        return false;
    },
    getMinimumVotes: function() {
        if (this.currentvote.type == 'kick') {
            return Math.ceil(this.getPlayers() / 2);
        } else {
            switch (this.getPlayers()) {
                case 1:
                    return 1
                case 2:
                    return 2
                default:
                    return Math.ceil(this.getPlayers() / 2);
            }
        }
    },
    hasVoted: function(player) {
        for (var i = 0; i < this.currentvote.votes.length; i++) {
            if (this.currentvote.votes[i].from.Name == player.Name) {
                return true;
            }
        }
        return false;
    },
    getCommandFromString: function(command) {
        var keys = Object.keys(this.configuration.commands);
        for (var i = 0; i < keys.length; i++) {
            if (this.configuration.commands[keys[i]].command.toLocaleLowerCase() == command.toLocaleLowerCase() || (this.configuration.commands[keys[i]].alias != null && this.configuration.commands[keys[i]].alias.toLocaleLowerCase() == command.toLocaleLowerCase())) {
                return this.configuration.commands[keys[i]];
            }
        }
        return false;
    },
    chunkArray: function(arr, len) {

        var chunks = [],
            i = 0,
            n = arr.length;

        while (i < n) {
            chunks.push(arr.slice(i, i += len));
        }

        return chunks;
    },
    onEventAsync: function(gameEvent, server) {
        if (this.currentvote.start != null && (new Date() - this.currentvote.start) / 1000 >= this.configuration.vote.duration) {
            gameEvent.Owner.Broadcast(`Vote to ${this.localization[this.currentvote.type].description.replace('%name%', this.currentvote.data.target.Name)} has ended`);
            if (this.checkCooldown(this.currentvote.data.from) < 0) {
                this.voteCooldowns.push({
                    player: this.currentvote.data.from,
                    start: new Date()
                })
            } else {
                for (var i = 0; i < this.voteCooldowns.length; i++) {
                    if (this.voteCooldowns[i].player.Name == this.currentvote.data.from.Name) {
                        this.voteCooldowns[i].start = new Date();
                    }
                }
            }
            this.resetVote();
        }
        for (var i = 0; i < this.currentEffects.length; i++) {
            if ((new Date() - this.currentEffects[i].start) / 1000 >= this.configuration.vote.duration * 2) {
                server.RconParser.ExecuteCommandAsync(server.RemoteConnection, this.configuration.effects[this.currentEffects[i].type].end.command);
                server.Broadcast(this.localization[this.currentEffects[i].type].message.replace('%value%', this.configuration.effects[this.currentEffects[i].type].end.value));
                this.currentEffects.splice(i, 1)
            }
        }
        this.server = server;
        switch (gameEvent.Type) {
            case 100:
                var message = gameEvent.Data.replace(/ +(?= )/g, '');
                var command = message.split(' ')[0]
                if (command[0] == '$') {
                    var commandData = this.getCommandFromString(command.substr(1).toLocaleLowerCase());
                    switch (true) {
                        case (!commandData):
                            gameEvent.Origin.Tell(`Command not found, type ^3$help^7 for a list of commands`);
                            return;
                        case (!commandData.enabled):
                            gameEvent.Origin.Tell(`Sorry ^5${commandData.type}^7 is not available`);
                            return;
                        case (gameEvent.Origin.ClientPermission.Level < commandData.level):
                            gameEvent.Origin.Tell(`You are not allowed to do that`);
                            return;
                    }
                    switch (commandData.type) {
                        case this.configuration.commands.maps.type:
                            var Maps = this.chunkArray(server.Maps.toArray(), 4);
                            for (var i = Maps.length - 1; i > 0; i--) {
                                for (var i = Maps.length - 1; i > 0; i--) {
                                    var line = '';
                                    for (var j = 0; j < Maps[i].length; j++) {
                                        line += `^7[^6${Maps[i][j]}^7]`;
                                    }
                                    gameEvent.Origin.Tell(line);
                                }
                            }
                            break;
                        case this.configuration.commands.help.type:
                            var command = message.substr(message.indexOf(' ') + 1);
                            var keys = Object.keys(this.configuration.commands);
                            for (var i = 0; i < keys.length; i++) {
                                if (this.configuration.commands[keys[i]].command.toLocaleLowerCase() == command.toLocaleLowerCase() || (this.configuration.commands[keys[i]].alias != null && this.configuration.commands[keys[i]].alias.toLocaleLowerCase() == command.toLocaleLowerCase())) {
                                    gameEvent.Origin.Tell(`[^6${this.configuration.commands[keys[i]].command}^7] ${this.configuration.commands[keys[i]].description}`);
                                    return;
                                }
                            }
                            for (var i = 0; i < keys.length; i++) {
                                gameEvent.Origin.Tell(`[^6${this.configuration.commands[keys[i]].command}^7] ${this.configuration.commands[keys[i]].description}`);
                                System.Threading.Thread.Sleep(100);
                            }
                            break;
                        case this.configuration.commands.yes.type:
                            switch (true) {
                                case (this.currentvote.type == null):
                                    gameEvent.Origin.Tell(`No vote is currently in progress`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                                case (this.currentvote.type == 'kick' && this.currentvote.data.target.Name == gameEvent.Origin.Name):
                                    gameEvent.Origin.Tell(`You can\'t votekick yourself ^5${gameEvent.Origin.Name}^7...`);
                                    return;
                            }
                            this.addVote(gameEvent.Origin, gameEvent.Owner);
                            break;
                        case this.configuration.commands.stop.type:
                            switch (true) {
                                case (gameEvent.Origin.ClientPermission.Level < this.modLevel):
                                    gameEvent.Origin.Tell(`You are not allowed to do that`);
                                    return;
                                case (this.currentvote.type == null):
                                    gameEvent.Origin.Tell(`No vote is currently in progress`);
                                    return;
                            }
                            gameEvent.Owner.Broadcast(`Vote to ${this.localization[this.currentvote.type].description.replace('%name%', this.currentvote.data.target.Name)} stopped`);
                            this.resetVote();
                            break;
                        case this.configuration.commands.skip.type:
                            switch (true) {
                                case (this.currentvote.type != null && this.currentvote.type != commandData.type):
                                    gameEvent.Origin.Tell(`Another vote is already in progress to ${this.localization[this.currentvote.type].description.replace("%name%", this.currentvote.data.target.Name)}`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                            }
                            this.addVote(gameEvent.Origin, server, param = {
                                type: commandData.type,
                                target: {
                                    Name: null,
                                    Namemp: null
                                }
                            });
                            break;
                        case this.configuration.commands.rgb.type:
                        case this.configuration.commands.jetpack.type:
                        case this.configuration.commands.explosives.type:
                            switch (true) {
                                case (this.currentvote.type != null && this.currentvote.type != commandData.type):
                                    gameEvent.Origin.Tell(`Another vote is already in progress to ${this.localization[this.currentvote.type].description.replace("%name%", this.currentvote.data.target.Name)}`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                            }
                            this.addVote(gameEvent.Origin, server, param = {
                                type: commandData.type,
                                target: {
                                    Name: null,
                                    Namemp: null
                                }
                            });
                            break;
                        case this.configuration.commands.jumpHeight.type:
                        case this.configuration.commands.gravity.type:
                            var value = parseInt(message.substr(message.indexOf(' ') + 1));
                            switch (true) {
                                case (!Number.isInteger(value)):
                                    gameEvent.Origin.Tell(`Usage: ${commandData.command} <value>`)
                                    return;
                                case (this.currentvote.type != null && this.currentvote.type != commandData.type):
                                    gameEvent.Origin.Tell(`Another vote is already in progress to ${this.localization[this.currentvote.type].description.replace("%name%", this.currentvote.data.target.Name)}`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                            }
                            this.addVote(gameEvent.Origin, server, param = {
                                type: commandData.type,
                                target: {
                                    Name: value,
                                    Namemp: null
                                }
                            });
                            break;
                        case this.configuration.commands.nextmap.type:
                        case this.configuration.commands.votemap.type:
                            if (message.indexOf(' ') < 0) {
                                gameEvent.Origin.Tell(`Usage: ${commandData.command} <mapname>`);
                                return;
                            }
                            var map = message.substr(message.indexOf(' ') + 1);
                            var target = this.getMap(map, server)
                            switch (true) {
                                case (!target):
                                    gameEvent.Origin.Tell('Map not found or not available');
                                    return;
                                case (this.currentvote.type != null && this.currentvote.type != commandData.type):
                                case (this.currentvote.type == commandData.type && this.currentvote.data.target.Name != target.Name):
                                    gameEvent.Origin.Tell(`Another vote is already in progress to ${this.localization[this.currentvote.type].description.replace("%name%", this.currentvote.data.target.Name)}`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                            }
                            this.logger.WriteInfo('here')
                            this.addVote(gameEvent.Origin, server, param = {
                                type: commandData.type,
                                target: target
                            });
                            break;
                        case this.configuration.commands.kick.type:
                            if (message.indexOf(' ') < 0) {
                                gameEvent.Origin.Tell(`Usage: ${command.substr(1).toLocaleLowerCase()} <player>`);
                                return;
                            }
                            var player = message.substr(message.indexOf(' ') + 1);
                            var target = server.GetClientByName(player).toArray()[0];
                            switch (true) {
                                case (!target):
                                    gameEvent.Origin.Tell('Player not found');
                                    return;
                                case (target.Name == gameEvent.Origin.Name):
                                    gameEvent.Origin.Tell(`You can\'t votekick yourself ^5${gameEvent.Origin.Name}^7...`);
                                    return
                                case (this.currentvote.type != null && this.currentvote.type != commandData.type):
                                case (this.currentvote.type == commandData.type && this.currentvote.data.target.Name != target.Name):
                                    gameEvent.Origin.Tell(`Another vote is already in progress to ${this.localization[this.currentvote.type].description.replace("%name%", this.currentvote.data.target.Name)}`);
                                    return;
                                case (this.hasVoted(gameEvent.Origin)):
                                    gameEvent.Origin.Tell(`You already voted!`);
                                    return;
                                case (this.getPlayers() < this.configuration.vote.minimumPlayers):
                                    gameEvent.Origin.Tell(`There must be atleast ^5${this.configuration.vote.minimumPlayers}^7 players to start a vote!`);
                                    return;
                                case (target.ClientPermission.Level >= this.immunityLevel):
                                    gameEvent.Origin.Tell(`Sorry, you cant kick ^5${target.Name}`);
                                    return;
                            }
                            this.addVote(gameEvent.Origin, server, param = {
                                type: commandData.type,
                                target: target
                            });
                            break;
                        default:
                            gameEvent.Origin.Tell(`Command not found, type ^3$help^7 for a list of commands`);
                            break;
                    }
                }
                break;
        }
    },

    onLoadAsync: function(manager) {
        this.manager = manager;
        this.logger = manager.GetLogger(0);
    },

    onUnloadAsync: function() {},

    onTickAsync: function(server) {}
};