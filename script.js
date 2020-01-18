generateFields();
var money = 1000;
var placed_bets = [];
var previous_numbers = [];
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
    var num = Math.floor(Math.random() * 37);
    previous_numbers.unshift(num);
    previous_numbers.splice(5, previous_numbers.length-5);
    var rolled_numbers = document.getElementById('rolled_numbers');
    rolled_numbers.innerHTML = "";
    for(var i = 0;i<previous_numbers.length;i++){
        console.log(previous_numbers[i]);
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
    if(num%2 == 0){
        document.getElementById("number_showcase").style.color = color_1;
    }else{
        document.getElementById("number_showcase").style.color = color_2;
    }
    if(num == 0){
        document.getElementById("number_showcase").style.color = "green";
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
    console.log(r+" | "+k);
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
    if(placed_bets.length < 5 || amount < 0 || clicked_existing){
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
                                }
                            }
                            break;
                        }
                    }
                }
            }
            bets.innerHTML += value +", "+ placed_bets[i][1] + "\n";
        }
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