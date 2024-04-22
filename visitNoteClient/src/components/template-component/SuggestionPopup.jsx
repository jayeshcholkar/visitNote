import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASEURL } from "../../units/constant";
import { List, Popover } from "antd";
import { Scrollbars } from "react-custom-scrollbars";
import { Link } from "react-router-dom";

const SuggestionsPopup = ({ inputValue, onSuggestionClick, inputRef }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [caretPosition, setCaretPosition] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [Suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const suggestionsRef = useRef(null);

  //this useEffect handle user's Outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const search = (wordAfterDotDot, suggestions) => {
    const query = wordAfterDotDot.toLowerCase();
    if (!suggestions) {
      return;
    }
    const filteredByWord = suggestions.filter(
      (item) => item.templateName.toLowerCase().indexOf(query) !== -1
    );
    return filteredByWord;
  };

  useEffect(() => {
    const triggerValue = inputValue.slice(-2);
    const regex = /\.\.(\w+)(?!.*\.\.(\w+))/;
    const match = inputValue.match(regex);
    if (match || triggerValue === "..") {
      if (match) {
        const wordAfterDotDot = match[1];
        let filter = search(wordAfterDotDot, Suggestions);
        setFilteredSuggestions(filter);
        setShowSuggestions(filter.length > 0);
      }
      if (triggerValue === "..") {
        const getSuggestions = async () => {
          const { data } = await axios.get(`${BASEURL}/dotphrase`);
          setFilteredSuggestions(data.dotPhrase);
          setSuggestions(data.dotPhrase);
        };
        getSuggestions();
        setShowSuggestions(true);
        // inputRef.current.editor.blur()
      }
    } else {
      setShowSuggestions(false);
    }

    //set the suggestions pop position
    if (inputRef.current && inputRef.current.editor) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setCaretPosition({
          x: rect.left,
          y: rect.bottom,
        });
      }
    }
  }, [inputValue, inputRef]);

  const handleSuggestionClick = (suggestion, id) => {
    onSuggestionClick(suggestion, id);
    setShowSuggestions(false);
  };

  // Handle key down event for arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showSuggestions) {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedSuggestionIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
          );
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedSuggestionIndex((prevIndex) =>
            prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
          );
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (selectedSuggestionIndex !== -1) {
            const suggestion = filteredSuggestions[selectedSuggestionIndex];
            handleSuggestionClick(suggestion.dotPhraseTemplate, suggestion._id);
            setShowSuggestions(false);
            setSelectedSuggestionIndex(0)
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSuggestions, filteredSuggestions, selectedSuggestionIndex]);

  return (
    <div
      style={{
        zIndex: 99,
        position: "fixed",
        left: caretPosition.x,
        top: caretPosition.y,
      }}
      ref={suggestionsRef}
    >
      {showSuggestions && (
        <div 
          className="suggestionList"
          autoFocus
        >
          <Scrollbars
            className="custom-scrollbar"
            autoHide
            autoHideTimeout={500}
            autoHideDuration={300}
            width={300}
            height={180}
          >
            <List
              itemLayout="horizontal"
              dataSource={filteredSuggestions}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    className="active"
                    key={index} 
                  >
                    <Link
                    style={{ 
                      background:
                        index === selectedSuggestionIndex && "#e7eefa", 
                    }}
                      onClick={() =>
                        handleSuggestionClick(item.dotPhraseTemplate, item._id)
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontWeight: '400'
                          }}
                        >
                          {item.templateName}
                        </span>
                        <b>{item.dotPhrase}</b>
                      </div>
                    </Link>
                  </List.Item>
                );
              }}
            />
          </Scrollbars>
        </div>
      )}
    </div>
  );
};
export default SuggestionsPopup;
