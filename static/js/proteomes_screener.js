$(document).ready(function(){
    $('#result').hide();




    $('#screener_submit').click(function() {
        $('#result').hide();
        // 檢查 input_allele 開關狀態
        var input_allele_checked = $('#filter-toggle').prop('checked');
        var input_allele = document.getElementById('selected_alleles');
        // var input_allele_Value = input_allele_checked ? input_allele.value : 9999;
        var input_allele_Value = input_allele.value ;
        console.log('input_allele',input_allele_Value);
        // 檢查 input_ID 開關狀態
        var input_ID_checked = $('#filter-ID').prop('checked');
        var input_ID = document.getElementById('selected_ID');
        // var input_ID_Value = input_ID_checked ? input_ID.value : 9999;
        var input_ID_Value = input_ID.value ;
        console.log('input_ID',input_ID_Value );
        // 檢查 nM_input 開關狀態
        var nM_checked = $('#toggle-nM').prop('checked');
        var nM_input = document.getElementById('nM_input');
        var nM_input_Value = nM_checked ? nM_input.value : 9999;
        var nM_condition = document.getElementById('nM_condition');
        var nM_condition_Value = nM_checked ? nM_condition.value : 8888;
        console.log('nM_condition',nM_condition_Value );
        console.log('nM_input',nM_input_Value );
        // 檢查 Rank_BA 開關狀態
        var Rank_BA_checked = $('#toggle-Rank_BA').prop('checked');
        var Rank_BA_input = document.getElementById('Rank_BA_input');
        var Rank_BA_input_Value = Rank_BA_checked ? Rank_BA_input.value : 9999;
        var Rank_BA_condition = document.getElementById('Rank_BA_condition');
        var Rank_BA_condition_Value = Rank_BA_checked ? Rank_BA_condition.value : 8888;
        console.log('Rank_BA_condition',Rank_BA_condition_Value );
        console.log('Rank_BA_input',Rank_BA_input_Value );

        //避免篩選錯誤
        if (nM_checked && nM_input_Value === '') {
            swal('Please input nM Value !');
            return;
        }else if (Rank_BA_checked && Rank_BA_input_Value === ''){
            swal('Please input Rank BA Value !');
            return;
        }
        ///////////////////////////////////////////////////////////////////////////////////////
        $.ajax({
            type: 'POST',
            url: '/proteomes/proteomes_screener_table/', 
            data: {
                'input_allele_Value':input_allele_Value,
                'input_ID_Value':input_ID_Value,
                'nM_condition_Value':nM_condition_Value,
                'nM_input_Value':nM_input_Value,
                'Rank_BA_condition_Value':Rank_BA_condition_Value,
                'Rank_BA_input_Value':Rank_BA_input_Value,
                },
                beforeSend:function(){
                    var count=0
                    tID= setInterval(timedCount , 50);
                        function timedCount() {
                        count=count+0.05;
                        swal({
                            title: "Running...",
                            text: "It may take several minutes.\nPlease be patient.\n \nRunning time: "+parseInt(count)+" seconds\nClick anywhere of the page \nif the running time does not change",                       
                            button: false,
                        });
                    };
                }, 
    
                success: function(response){
                    clearInterval(tID);
                    swal.close();
                    table_html = '<table id="result_Table" class="display" style="width:100%"></table>'
                    document.getElementById('ans_table').innerHTML = table_html;
                    var all_table_data = response.all_table_data_dict;
                    $('#result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        autoWidth: true,
                        data: all_table_data,
                        columns: [
                            { data: 'Pos', title: "Pos" },
                            { data: 'Peptide', title: "Peptide" },
                            { data: 'ID', title:"ID"},
                            // { data: 'Target', title:"Target"},
                            { data: 'Core', title:"Core"},
                            { data: 'Score', title: "Score" },
                            { data: 'Rank', title: "Rank" },
                            { data: 'Score_BA', title:"Score BA"},
                            { data: 'nM', title:"nM"},
                            { data: 'Rank_BA', title: "Rank BA" },
                            { data: 'allele', title: "allele "}
                        ],
                        deferRender: true, // Add deferRender option
                        destroy: true,
                        dom: 'Bfrtip', // Add this line to enable buttons
                        buttons: [
                            'copy', 'csv', 'excel', 
                        ]
                    });
                    $('#result').show();
                },
                error: function(){
                    clearInterval(tID);
                    swal.close();
                    swal('error')
                }
            })
    })

   
        

})