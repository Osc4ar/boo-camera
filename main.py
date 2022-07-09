from asyncore import dispatcher
import os
import time
from turtle import up

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

from telegram.ext import Updater, CommandHandler, MessageHandler, Filters

from dotenv import load_dotenv

load_dotenv()


def start(update, context):
    update.message.reply_text('Hi! Starting meeting')
    driver = create_driver()
    url = start_video_call(driver)
    update.message.reply_text(f'Meeting URL: {url}')


def create_driver():
    prefs = {
        "hardware.audio_capture_enabled": True,
        "hardware.video_capture_enabled": True,
        "hardware.audio_capture_allowed_urls": ["https://meet.jit.si"],
        "hardware.video_capture_allowed_urls": ["https://meet.jit.si"]
    }

    chrome_options = Options()
    chrome_options.add_experimental_option("prefs", prefs)
    chrome_options.add_experimental_option("detach", True)

    driver = webdriver.Chrome(options=chrome_options)
    return driver


def start_video_call(driver):
    driver.get("https://meet.jit.si")

    enter_room = driver.find_element(By.ID, 'enter_room_button')
    enter_room.click()

    time.sleep(5)

    participant_name = driver.find_element(
        By.CSS_SELECTOR, '#videoconference_page > div.premeeting-screen > div:nth-child(1) > div > div > div.prejoin-input-area > input')
    participant_name.send_keys('Boo')

    join_meeting = driver.find_element(
        By.CSS_SELECTOR, '#videoconference_page > div.premeeting-screen > div:nth-child(1) > div > div > div.prejoin-input-area > div > div')
    join_meeting.click()

    time.sleep(5)

    return driver.current_url


def main():
    BOT_TOKEN = os.getenv('BOT_TOKEN')
    updater = Updater(BOT_TOKEN, use_context=True)

    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler('start', start))

    updater.start_polling()

    updater.idle()

    print('Bot listening')


if __name__ == '__main__':
    main()
