# 깃허브 업로드 연습용 코드: 시간별 인사와 날짜 출력하기
import datetime

def get_greeting():
    """현재 시간에 맞춰 적절한 인사말을 반환합니다."""
    now = datetime.datetime.now()
    hour = now.hour

    if hour < 12:
        return "상쾌한 아침입니다! ☀️"
    elif hour < 18:
        return "활기찬 오후네요! ☕"
    else:
        return "편안한 밤 되세요! 🌙"

# 사용자 정보 설정
user_name = "초보 개발자" # 본인의 닉네임으로 바꿔보세요!
today = datetime.date.today()

# 결과 출력
print(f"안녕하세요, {user_name}님!")
print(f"오늘의 날짜: {today}")
print(f"메시지: {get_greeting()}")
print("-" * 40)
print("이 코드는 파이썬으로 작성된 나의 첫 깃허브 업로드 연습용입니다! 🐍")
