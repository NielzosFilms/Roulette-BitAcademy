generateFields();

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
            table_row.innerHTML += "<td onclick='placeBet(this)' class='betting_field' id='betting_field_R"+r+"K"+k+"'><div class='tooltip'>"+number+"<span class='tooltiptext' id='betting_field_tooltip_R"+r+"K"+k+"'>No bets</span></div></td>";
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
            }else if(number == 36){
                table.innerHTML += "<tr id='betting_field_table_row_"+(r+1)+"'></tr>";
                table_row = document.getElementById("betting_field_table_row_"+(r+1));
                for(var i = 1;i<=3;i++){
                    table
                    table_row.innerHTML += "<td onclick='placeBet(this)' class='betting_field' id='2_to_1_R"+r+"K"+k+"'><div class='tooltip'>2to1<span class='tooltiptext' id='betting_field_tooltip_R"+r+"K"+k+"'>No bets</span></div></td>";
                }
            }
            if(number%2 == 0){
                document.getElementById("betting_field_R"+r+"K"+k).style.backgroundColor = color_1;
            }else{
                document.getElementById("betting_field_R"+r+"K"+k).style.backgroundColor = color_2;
            }
        }
    }  
}

function turn(img) {
    var newone = img.cloneNode(true);
    img.parentNode.replaceChild(newone, img);
    var num = Math.floor(Math.random() * 36) + 1;
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
}

function placeBet(tile){

}