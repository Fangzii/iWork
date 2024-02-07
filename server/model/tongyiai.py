from http import HTTPStatus
import dashscope
from dashscope import Generation
from types import SimpleNamespace

MORE_DOUBLE = 10

# TODO base model
class TongYiAIModel:

    def __init__(self, mode, msg, key) -> None:
        self.mode = mode
        self.msg = msg
        dashscope.api_key = key
        self.result = None

    def message_response(self, result):
        """
        通用返回message
        兼容基础模型和chat 模型
        """
        res = result.output
        if res.choices:
            try:
                message = ''.join([item.text for item in res.choices])
            except Exception as e:
                message = ''.join([item.message.content for item in res.choices])
        else:
            message = res.error.message

        return message

    @property
    def get_chat_model_result(self):
        gen = Generation()
        result = gen.call(
            Generation.Models.qwen_turbo,
            messages=self.large_msg(self.msg),
            result_format='message',  # set the result to be "message" format.
        )    
        
        self.result = SimpleNamespace(**result) 
        return result

    @property
    def get_all_tokens(self):
        """
        获取单次消耗token
        """
        if self.result:
            return self.result.usage.total_tokens
        else:
            return 0

    @property
    def get_amount(self):
        """
        根据tokens 转为单次金额
        """
        tokens = self.get_all_tokens
        print(f'本次使用tokens 数量: {tokens}')
        one_token_cost = 0.002 / 1000
        exchange_rate = 7
        return tokens * one_token_cost * exchange_rate

    @property
    def get_finally_amount(self):
        """
        输出最终金额
        """
        amount = self.get_amount
        print(f'原始价格: {amount}')
        real_amount = amount * MORE_DOUBLE
        print(f'最终价格: {real_amount}')
        return real_amount

    def large_msg(self, msg):
        """
        3000 字符切割，支持大批量tokens
        """
        max_length = 3000
        result = []
        n = len(msg)
        if n <= max_length:
            result.append({'role': 'user', 'content': msg})
        else:
            num_chunks = (n + max_length - 1) // max_length
            for i in range(num_chunks):
                start = i * max_length
                end = (i + 1) * max_length
                chunk = msg[start:end]
                result.append({'role': 'user', 'content': chunk})
        return result