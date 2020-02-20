import React from 'react';
import ReactHover from 'react-hover';
import { Entry } from '../../_styled_components/displayPage';
import Link from '../../_styled_components/link';
import { getFullName } from '../../_helpers/getFullName';
import { Creator } from '../../../lib/interfaces';
import { MongoId } from '../../_interfaces';
import { EntryModal } from '../../_styled_components/entryModal';

interface MCEProps {
    creators: (Creator & MongoId)[] | undefined;
}

export const MultipleCreatorEntry: React.FunctionComponent<MCEProps> = ({
    creators
}) => {
    const options = {
        folowCursor: false,
        shiftX: 20,
        shiftY: 0
    };
    console.log(creators && creators.length > 0 && creators.length <= 1);

    return creators && creators.length > 0 ? (
        creators && creators.length <= 1 ? (
            <Entry>
                <Link
                    key={creators[0]._id}
                    to={`../creators/${creators[0]._id}`}
                >
                    {getFullName(creators[0])}
                </Link>
            </Entry>
        ) : (
            <ReactHover options={options}>
                <ReactHover.Trigger type="trigger">
                    <Entry>
                        <Link
                            key={creators[0]._id}
                            to={`../creators/${creators[0]._id}`}
                        >
                            {`${getFullName(creators[0])} & ...`}
                        </Link>
                    </Entry>
                </ReactHover.Trigger>
                <ReactHover.Hover type="hover">
                    <EntryModal>
                        {creators.slice(1).map(creator => (
                            <Link
                                key={creator._id}
                                to={`../creators/${creator._id}`}
                            >
                                {`${getFullName(creator)}`}
                            </Link>
                        ))}
                    </EntryModal>
                </ReactHover.Hover>
            </ReactHover>
        )
    ) : (
        <div>null option</div>
    );
};
