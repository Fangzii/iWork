"""
GPT 模块
"""
# pylint: disable=no-member
from .openai import OpenAIModel
from .tongyiai import TongYiAIModel
from server.settings import OPENAI_KEY, TY_KEY
from utils.enum import EOpenaiMode
from fee.models import Fee

class BaseGPT:
    """
    模型基类
    便于后续扩展新GPT 产品对接
    """

    mode: str
    result: str

    def __init__(self, msg, user=None) -> None:
        self.msg = msg
        self.user = user
        self.fee = None

    def do(self):
        """
        执行动作，所有动作管理
        """
        msg: dict = self.send()
        self.response()
        return msg

    def send(self) -> None:
        """ 发送消息 """

    def response(self) -> str:
        """ 回调处理 """

    @property
    def key(self) -> str:
        """
        根据模式选择不同的 key
        """
        return OPENAI_KEY

    def fee_deduction(self, amount):
        """
        扣除费用
        """
        fee = Fee.objects.get(user=self.user)
        return fee.deduction(amount)

    @property
    def fee_balance(self):
        fee = Fee.objects.get(user=self.user)
        return fee.amount


class EasyGPT(BaseGPT):
    """
    傻瓜GPT
    免费的openAI 比较傻但是免费 text-davinci-003 模型
    """

    def send(self):
        openai = OpenAIModel(EOpenaiMode.easy, self.msg, self.key)
        result = openai.get_base_model_result
        return openai.message_response(result)


class NormalGPT(BaseGPT):
    """
    chatGPT API 3.5
    """

    def send(self):
        openai = OpenAIModel(EOpenaiMode.normal, self.msg, self.key)
        result = openai.get_chat_model_result
        self.amount = openai.get_finally_amount
        return openai.message_response(result)

    def response(self) -> str:
        amount = self.fee_deduction(self.amount)
        print(f'当前剩余 {amount}')

class TYNormalGPT(BaseGPT):
    """
    ty 模型
    """

    def send(self):
        openai = TongYiAIModel(EOpenaiMode.normal, self.msg, TY_KEY)
        result = openai.get_chat_model_result
        self.amount = openai.get_finally_amount
        return openai.message_response(result)

    def response(self) -> str:
        amount = self.fee_deduction(self.amount)
        print(f'当前剩余 {amount}')


class SuperGPT(BaseGPT):
    """
    chatGPT API 4
    """

    def send(self):
        openai = OpenAIModel(EOpenaiMode.super, self.msg, self.key)
        result = openai.get_chat_model_result
        return openai.message_response(result)


class ManageGPT:
    """
    GPT 模型选择管理
    1. 根据用户情况以及剩余次数等维度选择使用某种模型
    """
    def __init__(self, user) -> None:
        self.user = user

    def choose(self, template=None):
        """ 选择管理 """
        fee = Fee.objects.get(user=self.user)
        if fee.amount_to_count > 0:
            print(f'当前用户剩余使用次数 {fee.amount_to_count}')
            if template:
                return TEMPLATE_MAP.get(template.model, NormalGPT)
            return NormalGPT
        else:
            return EasyGPT


TEMPLATE_MAP = {
    'TYAI': TYNormalGPT,
    'OPENAI': NormalGPT
}