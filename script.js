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
            table_row.innerHTML += "<td class='betting_field' id='betting_field_R"+r+"K"+k+"'>"+number+"</td>";
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
                    table_row.innerHTML += "<td class='betting_field' id='2_to_1_R"+r+"K"+k+"'>2to1</td>";
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