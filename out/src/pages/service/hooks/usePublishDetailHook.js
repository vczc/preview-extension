"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePublishDetailHook = void 0;
const services_1 = require("./../stores/services");
const serviceCheck_1 = require("../services/serviceCheck");
const nanoid_1 = require("nanoid");
const controls_1 = require("../constants/controls");
const lodash_1 = require("lodash");
function usePublishDetailHook() {
    const servicesStore = (0, services_1.useServicesStore)();
    // formatte data for item detail
    const formatteData = (data) => {
        const arr = [];
        Object.keys(data).map((key) => {
            const obj = {};
            obj.key = key;
            obj.options = [];
            obj.id = (0, nanoid_1.nanoid)();
            // it's string type means an it need a ui controler
            if ((0, lodash_1.isString)(data[key])) {
                // split a detail type, all types in #TYPES_MAP
                if (controls_1.BASE_INT_TYPES.includes(data[key])) {
                    // 数字类型
                    obj.type = 'int';
                }
                else if (controls_1.BASE_INPUT_TYPES.includes(data[key])) {
                    obj.type = 'string';
                }
                else if (controls_1.BASE_BOOL_TYPES.includes(data[key])) {
                    obj.type = 'bool';
                }
                else if (controls_1.BASE_FLOAT_TYPES.includes(data[key])) {
                    obj.type = 'double';
                }
            }
            else if ((0, lodash_1.isPlainObject)(data[key])) {
                // for nothing just tag
                obj.type = 'object';
                Object.keys(data[key]).forEach((_item) => {
                    if ((0, lodash_1.isInteger)(data[key][_item])) {
                        obj.options?.push({
                            label: _item,
                            value: data[key][_item]
                        });
                        obj.type = 'select';
                    }
                    else {
                        delete obj.options;
                    }
                });
                if (obj.type == 'select') {
                    obj.children = [];
                }
                else {
                    obj.children = formatteData(data[key]);
                }
            }
            else if ((0, lodash_1.isArray)(data[key])) {
                // if it's a add buton set the type be button
                obj.type = 'button';
                obj.newOption = formatteData(data[key][0]);
            }
            arr.push(obj);
        });
        return arr;
    };
    const initDetail = async (fieldName) => {
        const _details = await (0, serviceCheck_1.getFieldDetail)({
            appname: '',
            field_name: fieldName
        });
        if (_details.code === 200) {
            const transformData = formatteData(_details.data.input);
            _details.data.transformData = transformData;
            console.log('转换后的', _details.data);
            servicesStore.setTopicDetail(fieldName, _details.data);
        }
    };
    return {
        initDetail
    };
}
exports.usePublishDetailHook = usePublishDetailHook;
//# sourceMappingURL=usePublishDetailHook.js.map