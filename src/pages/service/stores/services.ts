import { defineStore } from 'pinia'

export const useServicesStore = defineStore('services', {
  state: () => ({
    form: {
      version: '',
      platform_info: '',
      ip_address: '',
      mask: '',
      arxml: '',
      service_clien_ip: '',
      // version: 'V1.2.0',
      // platform_info: 'QNX',
      // ip_address: '172.17.0.2',
      // mask: '255.255.255.0',
      // service_clien_ip: '',
      // arxml: '/home/a/work/soa/new_tool/svt/backend/files/arxml/ZSDB222400_ChargeService_1_P_PropulsionASWC_CSCBCACore.arxml'
    },
    topicDetail: {
      // OnBdChrgrPwrEnaAllwdStatus: {
      //   topic_name: 'OnBdChrgrPwrEnaAllwdStatus',
      //   input: { topicname: 'string', data: 'bool' },
      //   output: '',
      //   transformData: [
      //     {
      //       key: 'topicname',
      //       options: [],
      //       id: 'VLONdnUlCPg9sK7Vg6IlB',
      //       type: 'string',
      //       value: '212'
      //     },
      //     { key: 'data', options: [], id: 'WTC5wW1lXVhyD3KsLscsL', type: 'bool', value: true }
      //   ]
      // },
      // ChrgnDispStatus: {
      //   topic_name: 'ChrgnDispStatus',
      //   input: {
      //     topicname: 'string',
      //     data: {
      //       Default: 0,
      //       NoCharging: 1,
      //       ACCharging: 2,
      //       ACChargingEnd: 3,
      //       ACChargingCmpl: 4,
      //       Heating: 5,
      //       Booking: 6,
      //       NoDischarging: 7,
      //       Discharging: 8,
      //       DischargingEnd: 9,
      //       DischargingCmpl: 10,
      //       ChargingFault: 11,
      //       DischargingFault: 12,
      //       Reserved1: 13,
      //       ACChrgnFltChrgrSide: 14,
      //       DCCharging: 15,
      //       Reserved2: 16,
      //       Reserved3: 17,
      //       DCChrgnFltVehSide: 18,
      //       DCChrgnFltChrgrSideTempFlt: 19,
      //       DCChrgnFltChrgrSideConFlt: 20,
      //       DCChrgnFltChrgrSideHwFlt: 21,
      //       DCChrgnFltChrgrSideEmgyFlt: 22,
      //       DCChrgnFltChrgrSideComFlt: 23,
      //       SuperCharging: 24,
      //       ACChargingSuspend: 25,
      //       DCChargingEnd: 26,
      //       ACChrgnFltVehSide: 27,
      //       BoostCharging: 28,
      //       BoostChargingFlt: 29,
      //       WirelessCharging: 30
      //     }
      //   },
      //   output: '',
      //   transformData: [
      //     {
      //       key: 'topicname',
      //       options: [],
      //       id: '-rQUlAV_RhnwDGyae-N2g',
      //       type: 'string',
      //       value: 'asdf'
      //     },
      //     {
      //       key: 'data',
      //       options: [
      //         { label: 'Default', value: 0 },
      //         { label: 'NoCharging', value: 1 },
      //         { label: 'ACCharging', value: 2 },
      //         { label: 'ACChargingEnd', value: 3 },
      //         { label: 'ACChargingCmpl', value: 4 },
      //         { label: 'Heating', value: 5 },
      //         { label: 'Booking', value: 6 },
      //         { label: 'NoDischarging', value: 7 },
      //         { label: 'Discharging', value: 8 },
      //         { label: 'DischargingEnd', value: 9 },
      //         { label: 'DischargingCmpl', value: 10 },
      //         { label: 'ChargingFault', value: 11 },
      //         { label: 'DischargingFault', value: 12 },
      //         { label: 'Reserved1', value: 13 },
      //         { label: 'ACChrgnFltChrgrSide', value: 14 },
      //         { label: 'DCCharging', value: 15 },
      //         { label: 'Reserved2', value: 16 },
      //         { label: 'Reserved3', value: 17 },
      //         { label: 'DCChrgnFltVehSide', value: 18 },
      //         { label: 'DCChrgnFltChrgrSideTempFlt', value: 19 },
      //         { label: 'DCChrgnFltChrgrSideConFlt', value: 20 },
      //         { label: 'DCChrgnFltChrgrSideHwFlt', value: 21 },
      //         { label: 'DCChrgnFltChrgrSideEmgyFlt', value: 22 },
      //         { label: 'DCChrgnFltChrgrSideComFlt', value: 23 },
      //         { label: 'SuperCharging', value: 24 },
      //         { label: 'ACChargingSuspend', value: 25 },
      //         { label: 'DCChargingEnd', value: 26 },
      //         { label: 'ACChrgnFltVehSide', value: 27 },
      //         { label: 'BoostCharging', value: 28 },
      //         { label: 'BoostChargingFlt', value: 29 },
      //         { label: 'WirelessCharging', value: 30 }
      //       ],
      //       id: 'BkI36eAS_2oWipY9RZF84',
      //       type: 'select',
      //       children: [],
      //       value: 4
      //     }
      //   ]
      // }
    } as TopicDetail
  }),
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setTopicDetail(topicName: string, payload: any) {
      this.topicDetail[topicName] = payload;
    }
  }
});

interface TopicDetail {
  [key: string]: any
}
