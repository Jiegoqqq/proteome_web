$(document).ready(function(){
    $('#result').hide();

    $('#screener_submit').click(function() {
        // 檢查 Total Count 開關狀態
        var total_count_checked = $('#toggle-total').prop('checked');
        var select_count = document.getElementById('total_count');
        var select_count_Value = total_count_checked ? select_count.value : 9999;

        var select_count_condition = document.getElementById('total_count_condition');
        var select_count_condition_Value = total_count_checked ? select_count_condition.value : 8888;
        // 檢查 Mean Importance 開關狀態
        var importance_checked = $('#toggle-importance').prop('checked');
        var select_importance = document.getElementById('mean_importance');
        var select_importance_Value = importance_checked ? select_importance.value : 9999;
        var select_importance_condition = document.getElementById('mean_importance_condition');
        var select_importance_condition_Value = importance_checked ? select_importance_condition.value : 8888;
        // 檢查 AUC Value 開關狀態
        var auc_checked = $('#toggle-auc').prop('checked');
        var select_auc = document.getElementById('auc_value');
        var select_auc_Value = auc_checked ? select_auc.value : 9999;
        var select_auc_condition = document.getElementById('auc_value_condition');
        var select_auc_condition_Value = auc_checked ? select_auc_condition.value : 8888;

        var check_list = [];
        // 檢查 foldchange_checkbox 的狀態
        var foldisChecked = $('#foldchange_checkbox').prop('checked');
        if (foldisChecked) {
            console.log("Fold change Checkbox is checked.");
            check_list.push("foldchange");
        }

        // 檢查 test_checkbox 的狀態
        var testisChecked = $('#test_checkbox').prop('checked');
        if (testisChecked) {
            console.log("Test Checkbox is checked.");
            check_list.push("test");
        }
        $('#result').hide();
        // 获取输入值
        var select_cancer = document.getElementById('primary_select');
        var select_cancer_Value = select_cancer.value;
        var select_condition2 = document.getElementById('condition2');
        var select_condition2_Value = select_condition2.value;
        var select_condition1 = document.getElementById('condition1');
        var select_condition1_Value = select_condition1.value;
        // var FC_select = document.getElementById('FC_select');
        // var FC_select_Condition = FC_select.value;
        var log2FC_Condition = document.getElementById('log2FC_input');
        var log2FC_Condition_value= log2FC_Condition.value;
        var TEST_select = document.getElementById('TEST_select');
        var TEST_select_Value = TEST_select.value;
        // var TESTstates_select = document.getElementById('TESTstates_select')
        // var TESTstates_select_Value = TESTstates_select.value
        var TESTstates_modify = document.getElementById('TESTstates_modify')
        var TESTstates_modify_Value = TESTstates_modify.value
        var qvalue_input = document.getElementById('qvalue_input')
        var qvalue_input_Value = qvalue_input.value

        console.log('cancer ',select_cancer_Value);
        console.log('condition1',select_condition1_Value);
        console.log('condition2', select_condition2_Value);
        console.log('total count',select_count_Value);
        console.log('mean importance',select_importance_Value);
        console.log('auc value',select_auc_Value);
        // console.log('foldchange big',FC_select_Condition );
        console.log('foldchange input', log2FC_Condition_value);
        console.log('test select', TEST_select_Value);
        // console.log('Direction',TESTstates_select_Value);
        console.log('Correlation', TESTstates_modify_Value);
        console.log('q value', qvalue_input_Value)

        //避免篩選錯誤
        if (select_condition1_Value === 'E' && (select_condition2_Value !== 'N' && select_condition2_Value !== 'L')) {
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'L' && (select_condition2_Value !== 'N' && select_condition2_Value !== 'E')){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'S' && (select_condition2_Value !== 'N')){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'N' && (select_condition2_Value === 'N' )){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'A' && (select_condition2_Value !== 'B' && select_condition2_Value !== 'C' && select_condition2_Value !== 'D' && select_condition2_Value !== 'N')){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'B' && (select_condition2_Value !== 'A' && select_condition2_Value !== 'C' && select_condition2_Value !== 'D' && select_condition2_Value !== 'N')){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'C' && (select_condition2_Value !== 'A' && select_condition2_Value !== 'B' && select_condition2_Value !== 'D' && select_condition2_Value !== 'N')){
            swal('Please check the selected condition !')
            return; 
        }else if (select_condition1_Value === 'D' && (select_condition2_Value !== 'A' && select_condition2_Value !== 'B' && select_condition2_Value !== 'C' && select_condition2_Value !== 'N')){
            swal('Please check the selected condition !')
            return; 
        }
        
        $.ajax({
            type: 'POST',
            url: '/DEM/DEM_screener_table/', 
            data: {
                'select_cancer_Value':select_cancer_Value,
                'select_condition1_Value':select_condition1_Value,
                'select_condition2_Value':select_condition2_Value,
                'select_count_Value':select_count_Value,
                'select_importance_Value':select_importance_Value,
                'select_auc_Value':select_auc_Value ,
                'select_count_condition_Value':select_count_condition_Value,
                'select_importance_condition_Value':select_importance_condition_Value,
                'select_auc_condition_Value':select_auc_condition_Value,
                // 'FC_select_Condition': FC_select_Condition,
                'log2FC_Condition_value':log2FC_Condition_value,
                'TEST_select_Value': TEST_select_Value,
                // 'TESTstates_select_Value': TESTstates_select_Value,
                'TESTstates_modify_Value': TESTstates_modify_Value,
                'qvalue_input':qvalue_input_Value,
                'check_list': JSON.stringify(check_list)},
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
                var tableData = response.Table_Data_dict;
                var test_column_title = response.test_column_title

                if (check_list.includes("test")){
                    $('#result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        autoWidth: true,
                        data: tableData,
                        columns: [
                            { data: 'Metabolite', title: "Metabolite" },
                            { data: 'Total_Count', title: "Total Count" },
                            { data: 'Mean_Importance', title:"Mean Importance"},
                            { data: 'Metabolite_AUC', title:"AUC"},
                            { data: 'Metabolite name', title: "Metabolite name" },
                            { data: 'first_avg', title: "Condition 1 average" },
                            { data: 'second_avg', title:"Condition 2 average"},
                            { data: 'foldchange', title:"Fold change (Condition1/Condition2)"},
                            { data: test_column_title, title: "Q value" },
                        ],
                        deferRender: true, // Add deferRender option
                        destroy: true,
                        columnDefs: [
                            {
                                "render": function (data, type, row) {
                                    return parseFloat(data).toFixed(12);
                                },
                                "targets": [7]
                            }
                        ],
                        });
                }else{
                    $('#result_Table').DataTable({
                        searching: true,
                        paging: true,
                        info: true,
                        autoWidth: true,
                        data: tableData,
                        columns: [
                            { data: 'Metabolite', title: "Metabolite" },
                            { data: 'Total_Count', title: "Total Count" },
                            { data: 'Mean_Importance', title:"Mean Importance"},
                            { data: 'Metabolite_AUC', title:"AUC"},
                            { data: 'Metabolite name', title: "Metabolite name" },
                            { data: 'first_avg', title: "Condition 1 average" },
                            { data: 'second_avg', title:"Condition 2 average"},
                            { data: 'foldchange', title:"Fold change (Condition1/Condition2)"},
                        ],
                        deferRender: true, // Add deferRender option
                        destroy: true,
                        columnDefs: [
                            {
                                "render": function (data, type, row) {
                                    return parseFloat(data).toFixed(12);
                                },
                                "targets": [7]
                            }
                        ],
                        });
                }
                $('#result').show();
            },
            error: function(){
                clearInterval(tID);
                swal.close();
                swal('error')
                alert('Something error');
            },
        });
    });

})
