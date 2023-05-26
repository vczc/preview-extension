"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTopicHook = void 0;
const vue_1 = require("vue");
const serviceCheck_1 = require("../services/serviceCheck");
const usePublishDetailHook_1 = require("./usePublishDetailHook");
function useTopicHook() {
    // table ref
    const selectTableRef = (0, vue_1.ref)();
    const { initDetail } = (0, usePublishDetailHook_1.usePublishDetailHook)();
    // click batch remove btn
    const removeMultiple = () => {
        const _selecters = selectTableRef?.value?.getSelectionRows();
        console.log('当前选中行', _selecters);
    };
    // configs setting data
    const fields = (0, vue_1.reactive)({
        fields: [
        // {
        //   value: 'ChrgnDispStatus',
        //   label: ''
        // },
        // {
        //   value: 'OnBdChrgrPwrEnaAllwdStatus',
        //   label: ''
        // }
        ],
        fieldsSource: []
    });
    // init selector's data
    (0, vue_1.onMounted)(() => {
        initData();
    });
    const initData = async () => {
        const _fields = await (0, serviceCheck_1.getFields)({ appname: '' });
        if (_fields.code === 200) {
            const formatteFields = _fields.data.map((item) => {
                return {
                    value: item,
                    label: item,
                    selected: false
                };
            });
            fields.fieldsSource = formatteFields;
            _fields.data.forEach(async (item) => {
                // init selecter details
                // TODO: 记得打开下面注释
                // initDetail(item)
            });
        }
    };
    // when selecter change
    const changeSelect = (val) => {
        console.log('当前选项val', val);
        fields.fieldsSource = fields.fieldsSource.map((i) => {
            i.selected = val == i.value;
            return i;
        });
    };
    // click add btn
    const addRecord = () => {
        console.log('新增了');
        fields.fieldsSource.length > fields.fields.length &&
            fields.fields.push({
                value: '',
                label: ''
            });
    };
    // remove table row
    const removeRecord = (row, index) => {
        // 1. reset selecter options setting
        fields.fieldsSource = fields.fieldsSource.map((_) => {
            if (row.value === row.value)
                _.selected = false;
            return _;
        });
        // 2. remove table data
        fields.fields.splice(index, 1);
    };
    return {
        fields,
        selectTableRef,
        changeSelect,
        addRecord,
        removeRecord,
        removeMultiple
    };
}
exports.useTopicHook = useTopicHook;
//# sourceMappingURL=useTopicHook.js.map