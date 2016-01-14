using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CSCM.DataTableAjax
{
	/// <summary>
	/// 绑定数据的对象模版
	/// </summary>
	public class UserEval
	{
		internal string KeyName { get; set; }
		internal string KeyValueToUser { get; set; }
		internal ValueToUserInfo ValueToUserInfoHandle { get; set; }
		internal ColumnShowType KeyColumnShow { get; set; }
		/// <summary>
		/// 绑定字段
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		public UserEval(string _KeyName) 
		{
			KeyName = _KeyName;

		}
		/// <summary>
		/// 绑定字段
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		/// <param name="_KeyColumnShowType">显示类型</param>
		public UserEval(string _KeyName, ColumnShowType _KeyColumnShowType)
		{
			KeyName = _KeyName;
			KeyColumnShow = _KeyColumnShowType;
		}
		/// <summary>
		/// 绑定字段并进行处理
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		/// <param name="_KeyValueToUser">用于处理的字符串例如index?id=[value]程序自动将[value]替换为该字段的值</param>
		public UserEval(string _KeyName, string _KeyValueToUser)
		{
			KeyName = _KeyName;
			KeyValueToUser = _KeyValueToUser;

		}
		/// <summary>
		/// 绑定字段并进行处理
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		/// <param name="_KeyValueToUser">用于处理的字符串例如index?id=[value]程序自动将[value]替换为该字段的值</param>
		/// <param name="_KeyColumnShowType">显示类型</param>
		public UserEval(string _KeyName, string _KeyValueToUser, ColumnShowType _KeyColumnShowType)
		{
			KeyName = _KeyName;
			KeyValueToUser = _KeyValueToUser;
			KeyColumnShow = _KeyColumnShowType;
		}
		/// <summary>
		/// 绑定字段并自定义方法进行处理
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		/// <param name="_ValueToUserInfoHandle">需要绑定的委托</param>
		public UserEval(string _KeyName, ValueToUserInfo _ValueToUserInfoHandle)
		{
			KeyName = _KeyName;
			ValueToUserInfoHandle = _ValueToUserInfoHandle;
		}
		/// <summary>
		/// 绑定字段并自定义方法进行处理
		/// </summary>
		/// <param name="_KeyName">字段名称</param>
		/// <param name="_ValueToUserInfoHandle">需要绑定的委托</param>
		/// <param name="_KeyColumnShowType">显示类型</param>
		public UserEval(string _KeyName, ValueToUserInfo _ValueToUserInfoHandle, ColumnShowType _KeyColumnShowType)
		{
			KeyName = _KeyName;
			ValueToUserInfoHandle = _ValueToUserInfoHandle;
			KeyColumnShow = _KeyColumnShowType;
		}
	}
}
