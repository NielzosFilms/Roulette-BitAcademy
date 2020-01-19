generateFields();
var money = 1000;
var placed_bets = [];
var previous_numbers = [];
var wins = [];
document.getElementById('money_container').innerHTML = money;

function generateFields(){
    var table = document.getElementById('betting_field_table');
    var number = 0;
    var color_change = 0;
    var color_1 = "black";
    var color_2 = "red";
    for(var r = 1;r<=12;r++){
        table.innerHTML += "<tr id='betting_field_table_row_"+r+"'></tr>";
        var table_row = document.getElementById("betting_field_table_row_"+r);
        for(var k = 1;k<=3;k++){
            number++;
            table_row.innerHTML += "<td onclick='placeBet(this)' class='betting_field' id='betting_field_R"+r+"K"+k+"'><div class='tooltip'>"+number+"<span class='tooltiptext' id='betting_field_tooltip_R"+r+"K"+k+"'>0</span></div></td>";
            color_change++;
            if(color_change > 10){
                color_change = 0;
                var temp = color_1;
                color_1 = color_2;
                color_2 = temp;
            }else if(number == 18){
                color_change = 0;
            }else if(number == 19){
                color_1 = "black";
                color_2 = "red";
            }
            if(number%2 == 0){
                document.getElementById("betting_field_R"+r+"K"+k).style.backgroundColor = color_1;
            }else{
                document.getElementById("betting_field_R"+r+"K"+k).style.backgroundColor = color_2;
            }
            if(number == 36){
                table.innerHTML += "<tr id='betting_field_table_row_"+(r+1)+"'></tr>";
                table_row = document.getElementById("betting_field_table_row_"+(r+1));
                r = r+1;
                k = 0;
                for(var i = 1;i<=3;i++){
                    k = k+1;
                    table_row.innerHTML += "<td onclick='placeBet(this)' class='betting_field' id='betting_field_R"+r+"K"+k+"'><div class='tooltip'>2to1<span class='tooltiptext' id='betting_field_tooltip_R"+r+"K"+k+"'>0</span></div></td>";
                }
            }
        }
    }  
}

function turn() {
    var img = document.getElementById('wheel');
    var newone = img.cloneNode(true);
    img.parentNode.replaceChild(newone, img);
    //var num = Math.floor(Math.random() * 37);
    var num = 5;
    previous_numbers.unshift(num);
    previous_numbers.splice(5, previous_numbers.length-5);
    var rolled_numbers = document.getElementById('rolled_numbers');
    rolled_numbers.innerHTML = "";
    for(var i = 0;i<previous_numbers.length;i++){
        rolled_numbers.innerHTML += previous_numbers[i] + "\n";
    }
    var color_1 = "black";
    var color_2 = "red";
    if((num > 10 && num < 18) || num > 28){
        var temp = color_1;
        color_1 = color_2;
        color_2 = temp;
    }else if(num == 18){
        color_1 = "red";
        color_2 = "black";
    }
    document.getElementById('number_showcase').innerHTML = num;
    if(num%2 == 0 && num != 0){
        document.getElementById("number_showcase").style.color = color_1;
        checkWinCondition(num, color_1);
    }else if(num != 0){
        document.getElementById("number_showcase").style.color = color_2;
        checkWinCondition(num, color_2);
    }
    if(num == 0){
        document.getElementById("number_showcase").style.color = "green";
        checkWinCondition(num, "green");
    }
}

function placeBet(tile){
    var tile_id = tile.id;
    var r = tile_id.substr(15, 1);
    if(tile_id.substr(16, 1) != "K"){
        r += tile_id.substr(16,1);
    }
    var k = tile_id.substr(17, 1);
    if(tile_id.substr(16, 1) != "K"){
        k = tile_id.substr(18,1);
    }
    var tile_tooltip = document.getElementById('betting_field_tooltip_R'+r+'K'+k);
    var amount = document.getElementById('amount').value;
    if(parseInt(tile_tooltip.innerHTML, 10) + parseInt(amount) > 1000){
        amount = Math.abs(parseInt(tile_tooltip.innerHTML, 10)-1000);
    }else if(parseInt(tile_tooltip.innerHTML, 10) + parseInt(amount) < 0){
        amount = -(parseInt(tile_tooltip.innerHTML, 10));
    }
    var new_amount = parseInt(tile_tooltip.innerHTML, 10) + parseInt(amount);
    var temp_money = money;
    var clicked_existing = false;
    for(var i = 0;i<placed_bets.length;i++){
        var bet = placed_bets[i];
        if(bet[0] == tile_id){
            clicked_existing = true;
        }
    }
    if((placed_bets.length < 5 || amount < 0 || clicked_existing)){
        money = money-parseInt(amount);
        if(new_amount > 1000){
            money = temp_money;
            new_amount = 1000;
        }else if(new_amount < 0){
            money = temp_money;
            new_amount = 0;
        }

        var exists = false;
        for(var i = 0;i<placed_bets.length;i++){
            var bet = placed_bets[i];
            if(bet[0] == tile_id){
                if(new_amount == 0){
                    placed_bets.splice(i, 1);
                }else{
                    bet[1] = new_amount;
                }
                exists = true;
            }
        }
        if(!exists && amount != 0) placed_bets.push(new Array(tile_id, amount));
        setBets();
        document.getElementById('money_container').innerHTML = money;
        tile_tooltip.innerHTML = new_amount;
        if(tile_tooltip.innerHTML != "0"){
            tile.style.color = "#1F85DE";
            if(tile.style.backgroundColor == "" || tile.style.backgroundColor == "transparent" || tile.style.backgroundColor == "rgb(31, 133, 222)"){
                tile.style.backgroundColor = "#1F85DE";
                tile.style.color = "white";
            }
        }else {
            tile.style.color = "white";
            if(tile.style.backgroundColor == "rgb(31, 133, 222)"){
                tile.style.backgroundColor = "transparent";
            }
        }
    }
}

function checkWinCondition(num, color){
    won_money = 0;
    var length = placed_bets.length;
    while(placed_bets.length > 0 ){
        var i = 0;
        var value = document.getElementById(placed_bets[i][0]).innerHTML;
        var old_value = "";
        for(var j = 0;j<value.length;j++){
            var temp = value.charAt(j);
            if(temp == ">"){
                for(var l = j;l<value.length;l++){
                    var temp2 = value.charAt(l);
                    if(temp2 == "<"){
                        old_value = value;
                        value = value.substr(j+1, (l-j)-1);
                        if(value == ""){
                            if(old_value.indexOf("red") != -1){
                                value = "Red";
                            }else if(old_value.indexOf("black") != -1){
                                value = "Black";
                            }else if(old_value.indexOf("green") != -1){
                                value = "0";
                            }
                        }
                        if(old_value.indexOf("2to1") != -1){
                            var k = old_value.substr(81, 1);
                            value = "2to1_" + k;
                        }
                        break;
                    }
                }
            }
        }
        if(isNaN(value) && (value != "1st 12" && value != "2nd 12" && value != "3rd 12") && (value != "2to1_1" && value != "2to1_2" && value != "2to1_3")){
            if((value == "EVEN" && parseInt(num)%2 == 0) || (value == "ODD" && parseInt(num)%2 != 0) || (value == "Red" && color == "red") || (value == "Black" && color == "black") || (value == "1-18" && parseInt(num) > 0 && parseInt(num) <= 18) || (value == "19-36" && parseInt(num) > 18 && parseInt(num) <= 36) ){
                won_money += placed_bets[i][1]*2;
                wins.push(value + ", " + placed_bets[i][1]*2);
            }else {
                won_money -= placed_bets[i][1]*2;
            }
        }else if(value == "1st 12" || value == "2nd 12" || value == "3rd 12") {
            if((value == "1st 12" && parseInt(num) > 0 && parseInt(num) <= 12) || (value == "2nd 12" && parseInt(num) > 12 && parseInt(num) <= 24) || (value == "3rd 12" && parseInt(num) > 24 && parseInt(num) <= 36)){
                won_money += placed_bets[i][1]*3;
                wins.push(value + ", " + placed_bets[i][1]*3);
            }else{
                won_money -= placed_bets[i][1]*3;
            }   
        }else if(value == "2to1_1" || value == "2to1_2" || value == "2to1_3"){
            var success = false;
            if(value == "2to1_1"){
                for(var j = 1;j<=34;j+=3){
                    if(parseInt(num) == j){
                        success = true;
                    }
                }
            }
            if(value == "2to1_2"){
                for(var j = 2;j<=35;j+=3){
                    if(parseInt(num) == j){
                        success = true;
                    }
                }
            }
            if(value == "2to1_3"){
                for(var j = 3;j<=36;j+=3){
                    if(parseInt(num) == j){
                        success = true;
                    }
                }
            }
            if(success){
                won_money += placed_bets[i][1]*3;
                wins.push(value + ", " + placed_bets[i][1]*3);
            }else {
                won_money -= placed_bets[i][1]*3;
            }
        }else {
            if(parseInt(num) == parseInt(value)){
                won_money += placed_bets[i][1]*36;
                wins.push(value + ", " + placed_bets[i][1]*36);
            }else {
                won_money -= placed_bets[i][1]*36;
            }
        }
        resetBet(placed_bets[i][0]);
        placed_bets.splice(i, 1);
    }
    setWins();
    setBets();
    money += won_money;
    document.getElementById('money_container').innerHTML = money;
}

function resetBet(tile_id){
    var r = tile_id.substr(15, 1);
    if(tile_id.substr(16, 1) != "K"){
        r += tile_id.substr(16,1);
    }
    var k = tile_id.substr(17, 1);
    if(tile_id.substr(16, 1) != "K"){
        k = tile_id.substr(18,1);
    }
    document.getElementById(tile_id).style.color = "white";
    if(document.getElementById(tile_id).style.backgroundColor == "rgb(31, 133, 222)"){
        document.getElementById(tile_id).style.backgroundColor = "transparent";
    }
    document.getElementById('betting_field_tooltip_R'+r+'K'+k).innerHTML = "0";
}

function setBets(){
    var bets = document.getElementById('placed_bets');
    bets.innerHTML = "";
    for(var i = 0;i<placed_bets.length;i++){
        var value = document.getElementById(placed_bets[i][0]).innerHTML;
        var old_value = "";
        for(var j = 0;j<value.length;j++){
            var temp = value.charAt(j);
            if(temp == ">"){
                for(var l = j;l<value.length;l++){
                    var temp2 = value.charAt(l);
                    if(temp2 == "<"){
                        old_value = value;
                        value = value.substr(j+1, (l-j)-1);
                        if(value == ""){
                            if(old_value.indexOf("red") != -1){
                                value = "Red";
                            }else if(old_value.indexOf("black") != -1){
                                value = "Black";
                            }else if(old_value.indexOf("green") != -1){
                                value = "0";
                            }
                        }
                        if(old_value.indexOf("2to1") != -1){
                            var k = old_value.substr(81, 1);
                            value = "2to1_" + k;
                        }
                        break;
                    }
                }
            }
        }
        bets.innerHTML += value +", "+ placed_bets[i][1] + "\n";
    }
}

function setWins(){
    var win_container = document.getElementById('wins');
    win_container.innerHTML = "";
    for(var i = 0;i<wins.length;i++){
        win_container.innerHTML += wins[i] + "\n";
    }
}