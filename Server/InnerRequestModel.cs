using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace workflow.Contract
{
    public class InnerRequestModel
    {
        public long EmployeeID { get; set; }
        public long RequestID { get; set; }
        public string RequestNumber { get; set; }
        public SystemCartableType RequestType { get; set; }
    }


    public enum SystemCartableType
    {
        [Description("بازاریابی")]
        [EnumMember]
        Marketing = 1,
        [Description("ابطال")]
        [EnumMember]
        Cancelation = 2,
        [Description("تخصیص")]
        [EnumMember]
        Assignment = 3,
        [Description("تغییر شماره حساب اصلی")]
        [EnumMember]
        ChangeMainAccount = 4,
        [Description("تغییر آدرس و کدپستی و صنف")]
        [EnumMember]
        ChangeAddress = 5,
        [Description("تغییر اطلاعات شاپرکی پذیرنده")]
        [EnumMember]
        ChangeMerchantShaparakValue = 6,
        [Description("تغییر سرویسهای ترمینال")]
        [EnumMember]
        ChangeTerminalService = 7,
        [Description("تغییر اطلاعات داخلی پذیرنده")]
        [EnumMember]
        ChangeMerchantInternalValue = 8,
        [Description("بازایابی فایلی")]
        [EnumMember]
        FileMarketing = 9,
        [Description("تغییر سرویسهای ترمینال فایلی")]
        [EnumMember]
        FileChangeTerminalService = 10,
        [Description("نصب")]
        [EnumMember]
        Installation = 11,
        [Description("بارگذاری مدارک")]
        [EnumMember]
        UploadDocument = 12,
        [Description("تغییر شماره حساب فرعی")]
        [EnumMember]
        ChangeSecondaryAccount = 13
    }
}
